// app/api/waitlist/route.ts
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

interface WaitlistData {
  fullName: string;
  email: string;
  userRole: string;
  serviceCategory?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: WaitlistData = await request.json();
    const { fullName, email, userRole, serviceCategory } = body;

    // Validate required fields
    if (!fullName || !email || !userRole) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // For providers, serviceCategory is required
    if (userRole === 'provider' && !serviceCategory) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Service category is required for providers' 
        },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // First, check if the sheet has headers, if not add them
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A1:E1',
    });

    // If no headers exist, add them
    if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1:E1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Full Name', 'Email', 'User Role', 'Service Category', 'Date Joined']]
        }
      });
    }

    // Prepare the row data
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const rowData = [
      fullName,
      email,
      userRole,
      serviceCategory || '', // Empty string if not provided
      currentDate
    ];

    // Append the new row
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:E',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist',
      data: {
        fullName,
        email,
        userRole,
        serviceCategory,
        dateJoined: currentDate
      }
    });
    
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add to waitlist',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: GET method to retrieve waitlist data
export async function GET(request: NextRequest) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:E', // Get all waitlist data
    });
    
    const rows = response.data.values || [];
    
    // Skip header row and format data
    const waitlistData = rows.slice(1).map(row => ({
      fullName: row[0] || '',
      email: row[1] || '',
      userRole: row[2] || '',
      serviceCategory: row[3] || '',
      dateJoined: row[4] || ''
    }));
    
    return NextResponse.json({
      success: true,
      data: waitlistData,
      count: waitlistData.length
    });
    
  } catch (error) {
    console.error('Error fetching waitlist data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch waitlist data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}