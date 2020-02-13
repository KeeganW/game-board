# Game Board
Game board is an application for tracking games played with your friend groups, and viewing their results in interesting ways. 

# Running Game Board
In order to run this application, follow the following directions to run the game on your local machine.

## First Time Setup
1. Clone the repository
    - `git clone https://github.com/KeeganW/game-board.git && cd game-board`
2. Install the requirements (it is recommended you do this inside a virtual environment. See [Configuring your local environment](https://github.com/KeeganW/game-board/wiki/Configuring-Your-Local-Environment))
    - `pip install -r requirements.txt`
3. Setup your local variables
    - `export SECRET_KEY="$(cat /dev/urandom | env LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)"`
    - (optional, if running on a remote server) `export WEBSITE_SITE_NAME="<this machine's full dns name>"`
4. Create your database
    - `python manage.py makemigrations gameboard && python manage.py migrate --run-syncdb`

## Running the website
1. Run the web server.
    - `python manage.py runserver localhost:8080`
2. Open a browser to [localhost:8080](http://localhost:8080/).

## (Optional) Load Test Dataset
1. Just navigate to [the import page](http://localhost:8080/import).

For additional information, please see our [Wiki Page](https://github.com/KeeganW/game-board/wiki).