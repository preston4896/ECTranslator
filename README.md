# ECTranslator by Preston Ong and Sach Samala

## Instruction To Use:

If the web site is not live, run `NodeJS` on the server. Otherwise if you do not have access to the server, please contact us.

To launch the website, go to the browser and enter http://server162.site:53754/ECTranslator.html.

## API queries

You may insert API query into the URL address to receive data in JSON format.

To insert a query, add a backslash after the port number, then enter the appropriate query key word for the specific data.

For example:

`server162.site:53754/` query begins here

#### Translate API

To get the translate data, enter:

`/translate?english = ` English word goes here

#### Store API

You can manually store data into the database by inserting this query. However, you will have to also manually insert the Chinese output into the URL address. For example:

`/store?english= ` English word goes here `&chinese= ` Chinese word goes here

#### Print API

This query prints out the entire database. You must be logged in to access this query. Insert:

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

- Link login page to creation page.

- Add code to support Google Account (OAuth2) authentication.

#### Current Agenda

- CSS Designs.

- Modify "Seen" and "Correct" counts in the database. (High Priority)

- Login page needs to determine whether to redirect to creation or review page, based on new vs returning users.

- Database should include user first, last name, Google ID (unique primary key).

- Make sure cards are only visible to the correct user.

#### Next Agenda

- Consider using React Production Build by mini-fying `ECTReact.js` for faster page rendering.
