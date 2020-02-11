from datetime import datetime

from django import forms
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.forms import DateInput

from gameboard.models import Round, Game


class ImportScoresForm(forms.Form):
    # title = forms.CharField(max_length=50)
    scores = forms.FileField()


class AddRoundForm(forms.Form):
    """
    """
    game = forms.CharField(label='Game:', max_length=50)
    date = forms.DateTimeField(
        label='Date:',
        input_formats=['%m/%d/%Y', '%Y-%m-%d'],
        widget=forms.DateInput(attrs={
            'class': 'form-control datetimepicker-input',
            'data-target': '#datetimepicker1',
            'type': 'date',
            'value': datetime.now().strftime("%Y-%m-%d")
        })
    )
    player = forms.CharField(label='Player:', required=False, max_length=50)
    players = forms.CharField(widget=forms.HiddenInput(), required=False)
    winners = forms.CharField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = Round
        fields = ('game', 'date', 'players', 'winners')

    def __init__(self, *args, **kwargs):
        """
        Add a specific class when generating the HTML code for easier styling.

        :param args: Form args
        :param kwargs: Form keyword args
        """
        super(AddRoundForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control autocomplete'

    def clean(self):
        """
        Clean the data provided by the user. Raise an error if the data is not proper.

        :return: The cleaned data
        """
        # Clean the data
        cleaned_data = super().clean()

        # Assign possible values
        game = cleaned_data.get('game')
        date = cleaned_data.get('date')
        players = cleaned_data.get('players')
        winners = cleaned_data.get('winners')

        print(players)

        if game:
            if date:
                if players:
                    if winners:
                        # TODO Everything exists, validate the content.
                        # Does the game exist?
                        # Is the date within the last year?
                        # Is the date not in the future?
                        # Are the players in this group?
                        # Is there a winner that isn't a player?

                        # Everything works!
                        return cleaned_data

                    raise forms.ValidationError("Winners are required")
                raise forms.ValidationError("Participating players are required")
            raise forms.ValidationError("Date is required")
        raise forms.ValidationError("Game name is required")


class LoginForm(forms.Form):
    """
    """
    # Fields needed to login
    username = forms.CharField(label='Username', max_length=40)
    password = forms.CharField(max_length=32, widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        """
        Add a specific class when generating the HTML code for easier styling.

        :param args: Form args
        :param kwargs: Form keyword args
        """
        super(LoginForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'
            visible.field.widget.attrs['autocomplete'] = 'off'

    def clean(self):
        """
        Clean the data provided by the user. Raise an error if the data is not proper.
        Guided by https://stackoverflow.com/questions/1395807/proper-way-to-handle-multiple-forms-on-one-page-in-django

        :return: The cleaned data
        """
        # Clean the data
        cleaned_data = super().clean()

        # Assign possible values
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')

        # Check that form was properly filled out
        if username:
            if password:
                # Authenticate the user, then log them in.
                user = authenticate(username=username, password=password)
                if user is None:
                    raise forms.ValidationError("Your username and password combination does not exist.")

                # Everything works!
                return cleaned_data

            raise forms.ValidationError("Password is required")
        raise forms.ValidationError("Username is required")


class RegisterForm(forms.Form):
    """
    """
    # The fields needed to register as a new user
    username = forms.CharField(label='Username', max_length=40)
    first_name = forms.CharField(label='First Name', max_length=100)
    last_name = forms.CharField(label='Last Name', max_length=100)
    password = forms.CharField(max_length=32, widget=forms.PasswordInput)
    password_confirm = forms.CharField(max_length=32, widget=forms.PasswordInput)

    # Add a specific class when generating the html code
    def __init__(self, *args, **kwargs):
        """
        Add a specific class when generating the HTML code for easier styling.

        :param args: Form args
        :param kwargs: Form keyword args
        """
        super(RegisterForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'

    def clean(self):
        """
        Clean the data provided by the user. Raise an error if the data is not proper.
        Guided by https://stackoverflow.com/questions/1395807/proper-way-to-handle-multiple-forms-on-one-page-in-django

        :return: The cleaned data
        """
        # Clean the data
        cleaned_data = super().clean()

        # Assign possible values
        username = cleaned_data.get('username')
        first_name = cleaned_data.get('first_name')
        last_name = cleaned_data.get('last_name')
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        # Check that form was properly filled out
        if username:
            if first_name:
                if last_name:
                    if password:
                        if password_confirm:
                            # Passwords should be more than 6 characters
                            if len(cleaned_data['password']) < 6:
                                raise forms.ValidationError("Your password needs to be longer than 6 characters.")

                            # Passwords should match
                            if cleaned_data['password'] != cleaned_data['password_confirm']:
                                raise forms.ValidationError("Your passwords do not match.")

                            # Username should not be used already
                            if User.objects.filter(username=cleaned_data['username']):
                                raise forms.ValidationError("This username is already being used.")

                            # Everything works!
                            return cleaned_data

                        raise forms.ValidationError("You must confirm your password.")
                    raise forms.ValidationError("Password is required.")
                raise forms.ValidationError("Your last name is required.")
            raise forms.ValidationError("Your first name is required.")
        raise forms.ValidationError("Username is required.")


class AddGameForm(forms.Form):
    """
    """
    # The fields needed to register as a new user
    name = forms.CharField(label='Name', max_length=50)
    description = forms.CharField(label='Description', max_length=400, required=False)

    # Add a specific class when generating the html code
    def __init__(self, *args, **kwargs):
        """
        Add a specific class when generating the HTML code for easier styling.

        :param args: Form args
        :param kwargs: Form keyword args
        """
        super(AddGameForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'

    def clean(self):
        """
        Clean the data provided by the user. Raise an error if the data is not proper.
        Guided by https://stackoverflow.com/questions/1395807/proper-way-to-handle-multiple-forms-on-one-page-in-django

        :return: The cleaned data
        """
        # Clean the data
        cleaned_data = super().clean()

        # Assign possible values
        name = cleaned_data.get('name')
        description = cleaned_data.get('description')

        # Check that form was properly filled out
        if name:
            # Everything works!
            return cleaned_data
        raise forms.ValidationError("The game's name is required.")


class EditForm(forms.Form):
    # The fields needed to register as a new user
    username = forms.CharField(label='Username', max_length=50, required=False)
    first_name = forms.CharField(label='First Name', max_length=100, required=False)
    last_name = forms.CharField(label='Last Name', max_length=100, required=False)
    favorite_game = forms.CharField(label='Favorite Game', max_length=50, required=False)
    password = forms.CharField(max_length=32, widget=forms.PasswordInput, required=False)
    password_confirm = forms.CharField(max_length=32, widget=forms.PasswordInput, required=False)
    current_username = None

    # Add a specific class when generating the html code
    def __init__(self, current_username, *args, **kwargs):
        """
        Add a specific class when generating the HTML code for easier styling.

        :param args: Form args
        :param kwargs: Form keyword args
        """
        self.current_username = current_username
        super(EditForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'

    def clean(self):
        """
        Clean the data provided by the user. Raise an error if the data is not proper.
        Guided by https://stackoverflow.com/questions/1395807/proper-way-to-handle-multiple-forms-on-one-page-in-django

        :return: The cleaned data
        """
        # Clean the data
        clean_data = super().clean()

        # Assign possible values
        username = clean_data.get('username')
        first_name = clean_data.get('first_name')
        last_name = clean_data.get('last_name')
        favorite_game = clean_data.get('favorite_game')
        password = clean_data.get('password')
        password_confirm = clean_data.get('password_confirm')


        # Check that form was properly filled out
        if username:
            # Username should not be used already
            if self.current_username != clean_data['username'] and User.objects.filter(username=clean_data['username']):
                raise forms.ValidationError("This username is already being used.")
        if first_name:
            pass
        if last_name:
            pass
        if favorite_game:
            if not Game.objects.filter(name=clean_data['favorite_game']).first():
                raise forms.ValidationError("This game is not a real game, or has not been added yet.")
        if password:
            # Both passwords need to be entered
            if not password_confirm:
                raise forms.ValidationError("You need to confirm your password.")

            # Passwords should be more than 6 characters
            if len(clean_data['password']) < 6:
                raise forms.ValidationError("Your password needs to be longer than 6 characters.")
        if password_confirm:
            # Both passwords need to be entered.
            if not password:
                raise forms.ValidationError("You need to enter a password as well.")

            # Passwords should match
            if clean_data['password'] != clean_data['password_confirm']:
                raise forms.ValidationError("Your passwords do not match.")


        # Everything works!
        return clean_data


class EditGroupForm(forms.Form):
    # The fields needed to register as a new user
    OPTIONS = [
        ("0", "ALL"),
        ("1", "New York"),
        ("2", "Los Angeles"),
    ]
    group_name = forms.CharField(label='Group Name', max_length=40, required=False,widget=forms.TextInput(attrs={'placeholder':"Change Group Name"}))

    remove_player = forms.MultipleChoiceField(
        widget=forms.CheckboxSelectMultiple(),
        label="remove player", required=True, error_messages={'required': 'myRequiredMessage'})

    add_player = forms.MultipleChoiceField(
        widget=forms.CheckboxSelectMultiple(),
        label="add player", required=True, error_messages={'required': 'myRequiredMessage'})

    make_admin = forms.MultipleChoiceField(
        widget=forms.CheckboxSelectMultiple(),
        label="make admin", required=True, error_messages={'required': 'myRequiredMessage'})

    make_player = forms.MultipleChoiceField(
        widget=forms.CheckboxSelectMultiple(),
        label="make player", required=True, error_messages={'required': 'myRequiredMessage'})

    # Add a specific class when generating the html code
    def __init__(self, remove_player, make_admin, add_player,make_player, *args, **kwargs):
        """
        Add a specific class when generating the HTML code for easier styling.

        :param args: Form args
        :param kwargs: Form keyword args
        """
        super(EditGroupForm, self).__init__(*args, **kwargs)

        self.fields['remove_player'].choices = remove_player
        self.fields['add_player'].choices = add_player
        self.fields['make_admin'].choices = make_admin
        self.fields['make_player'].choices = make_player
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'
