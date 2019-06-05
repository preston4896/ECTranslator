# ECTranslator by Preston Ong and Sach Samala


#### Progress Log

- Set up Google Cloud and acquired Google Translate API Key: AIzaSyATOeTMHkeAzNdg0PJ7zp0xCZqOpBo_Ebs

- Server can now handle translate query and return output to the HTML page.

- Set up database.

- Database should only contains 5 columns. There are: user, English, Traditional Chinese, # of Seens and # of Corrects.

- Card Creation Page is now built with React.

- React rendering for multiple page.

- Send a request to server to fetch database (received from client-side).

- Review Page is functional.

#### Current Agenda

- Link login page to creation page for now. Later, it is determined to whether land on creation or review, based on new vs returning users.

- CSS Designs.

- Modify "Seen" and "Correct" counts in the database.

#### Next Agenda

- Add code to support Google Account authentication.

- Database should include user first, last name, Google ID (unique primary key).

- Make sure cards are only visible to the correct user.

- Redirection. New users land on create cards view; otherwise to the card table (database) view.