import { NextResponse, NextRequest } from 'next/server';

// Function to check user authentication via API call
async function checkUserAuthentication(request) {
  // Retrieve the jwt_token from cookies
  const jwtToken = request.cookies.get('jwt_token');
 
  if (!jwtToken && !jwtToken.value) {
    console.log('No jwt token')
    // If jwt_token is not found, redirect to login
    return { isValid: false, redirect: true };
  }

  // API endpoint for checking authentication
  const apiEndpoint = `${process.env.API_URL}user/check_auth`;
  const requestBody = {
    token: process.env.MYKEY,
  };

  try {
    // API request to validate the token
    const apiResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && !data.error) {
        // Successful authentication, set the cookie here
        const response = NextResponse.next();
        response.cookies.set('user_data', JSON.stringify(data), {
          httpOnly: true,
          secure: request.url.startsWith('https'),
          sameSite: 'lax',
          maxAge: 86400, // Cookie expiry set to 1 day (86400 seconds)
        });


        return { response, data, isValid: true };
      }
    }


    return { isValid: false };

  } catch (error) {
    console.error('Error checking user authentication:', error);
    return { isValid: false };
  }
}

// Middleware function
export async function middleware(request) {

  const requiresAuthPaths = ['/group',];

  if (requiresAuthPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    const { response, isValid, redirect } = await checkUserAuthentication(request);

    if (redirect) {

      return NextResponse.redirect(new URL('/account/user_login', request.url));
    }

    if (isValid) {


      return response;
    } else {

      return NextResponse.redirect(new URL('/account/user_login', request.url));
    }
  }

  const MainAdminOnly = ['/p/edit/',];

  if (MainAdminOnly.some(path => request.nextUrl.pathname.startsWith(path))) {
    const { response, isValid, redirect, data } = await checkUserAuthentication(request);

    if (redirect) {

      return NextResponse.redirect(new URL('/account/user_login', request.url));
    }

    if (isValid) {
      console.log('response Data');
      if (data.UserData.Role == 1) {
        return response;
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }

    } else {

      return NextResponse.redirect(new URL('/account/user_login', request.url));
    }
  }

  return NextResponse.next();
}
