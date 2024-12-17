# Licker

This is a tutorial application that will show some of essentials of development and other things.

The main purpose of this application is to scrape data from a public website. And then send notifications in Telegram.

As an example, receiving a news feed from [RIA Novosti](https://ria.ru/) website is used.

## Development

1. Clone this repo

    ```sh
    git clone https://github.com/lesha-filimonov/licker.git
    ```

2. Go to the project directory

    ```sh
    cd licker
    ```

3. Install dependencies

    ```sh
    npm install
    ```

4. Make `.env` file

    ```sh
    cp .env.example .env
    ```

    And then edit the values in `.env`

5. Make `.secret` file

    ```sh
    cp .secret.example .secret
    ```

    And then edit the values in `.secret`

6. Start locally

    ```sh
    npm start
    ```

