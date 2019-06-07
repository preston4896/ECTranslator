# ECTranslator by Preston Ong and Sach Samala

## Instruction To Use:

If the web site is not live, run `NodeJS` on the server. Otherwise if you do not have access to the server, please contact us.

To launch the website, go to the browser and enter http://server162.site:53754/ECTlogin.html.

## API queries

#### NOTE: Users must sign in to Google to query APIs.

Users may insert API query into the URL address to receive data in JSON format.

To insert a query, add a slash after the `users` directory in the URL, then enter the appropriate query key word for the specific data.

For example:

`server162.site:53754/users/` query begins here

#### Translate API

To get the translate data, enter:

`/translate?english = ` English word goes here

#### Store API

Users can manually store data into the database by inserting this query. However, users will have to also manually insert the Chinese output into the URL address. For example:

`/store?english= ` English word goes here `&chinese= ` Chinese word goes here

#### Print API

This query prints out the entire database. Insert:

`/print`

------------------

#### Progress Log

- Set up Google Cloud and acquired Google Translate API Key.

- Server can now handle translate query and return output to the HTML page.

- Set up database.

- Database should only contains 5 columns. There are: user, English, Traditional Chinese, # of Seens and # of Corrects.

- Card Creation Page is now built with React.

- React rendering for multiple page.

- Send a request to server to fetch database (received from client-side).

- Review Page is functional.

- Linked login page to creation page.

- Added code to support Google Account (OAuth2) authentication.

- Fixed Memory Leak while rendering Review Page.

- The app is currently using React Production Build with minified `ECTReact.min.js` for faster page rendering.

#### Future Improvement(s) To Be Made:

- CSS Designs.

- Modify "Seen" and "Correct" counts in the database.

- Login page needs to determine whether to redirect to creation or review page, based on new vs returning users.

- Database should include user first, last name, Google ID (unique primary key).

- Make sure cards are only visible to the correct user.