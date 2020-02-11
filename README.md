# Starting Game Board
Navigate to the directory with the django manage file.
```bash
cd src/gameboardapp
```
## Setup
Create the database by migrating with the following
```bash
python manage.py makemigrations gameboard
python manage.py migrate --run-syncdb
```
## Running
Run the web server.
```bash
python manage.py runserver localhost:8080
``` 
Open a browser to [localhost:8080](http://localhost:8080/).

## Load Data
Just navigate to [the import page](http://localhost:8080/import).

# TODO Feature list
- Change fonts
- Get profile pictures working
- Fix edit group page
    - Make more complete, different layout
    - Get dropdowns working with correct formatting
- Fix all css pages
- Change add data page
    - Change Game selection to a dropdown (with text input? is that possible?)
    - Add a add game button/modal
- Add a new group/find group function to a new users page
- Auto highlight from autofill to indicate that it is selected (and enter can be pressed)
- Add hover text for submit and submit and clear
- Put submit and clear before submit



# IDE Configuration
## Intellij
To setup intellij to work on and run the code natively, follow these steps.

- File -> Open
- Select the top level directory for this repository
- Project settings
	- Project
		- Project SDK should be set to python env set up before. If not, click new > python SDK. Select existing environment, which should be in your home directory in the .virtualenvs directory.
	- Modules
		- Select the `+` sign > New Module
		- Python
			- Select the checkbox next to Django
			- Application name: Game Board, Next
			- Module Name: Game Board, Finish
		- Click on the new module
			- Change project root to src directory
			- Change settings to point at gameboardapp/settings.py
			- Point manage script to the manage.py file
	- Apply and OK
- Add Configuration
	- Host: localhost
	- Environment Variables: Click on the right side of the text box
		- Add `DJANGO_SETTINGS_MODULE` with its value being `gameboardapp.settings`
	- Apply and OK


# Configuring your local environment (extended)
## MacOS
- Install homebrew
`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- Install python3
```bash
brew install python
export PATH="/usr/local/opt/python/libexec/bin:/usr/local/sbin:$PATH"
```
- Install virtualenv and wrapper
```bash
pip install virtualenv
pip install virtualenvwrapper
export WORKON_HOME=$HOME/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
```
- Create a virtualenvironment
`mkvirtualenv general`
- Install this
MacOS
`brew install postgresql`
`pip install -r requirements.txt`

## Ubuntu
```bash
sudo apt-get install python-pip
sudo pip install virtualenv
mkdir ~/.virtualenvs
sudo pip install virtualenvwrapper
export WORKON_HOME=~/.virtualenvs
```
Add to bashrc `. /usr/local/bin/virtualenvwrapper.sh`

```bash
source ~/.bashrc
mkvirtualenv --python=/usr/bin/python3 general
pip install -r requirements.txt
```