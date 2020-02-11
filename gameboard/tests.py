from django.contrib.auth.models import User
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.test import TestCase, LiveServerTestCase, Client
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from gameboard.models import Player, Round, Game, Group
import datetime


class TestGameBoardModels(TestCase):
    @classmethod
    def setUpTestData(cls):
        u1 = User(first_name="Keegan", last_name="Williams", email="gameboard@gmail.com", username="keegan", password="password")
        u1.save()
        u2 = User(first_name="John", last_name="Doe", email="gameboard@gmail.com", username="john", password="password")
        u2.save()
        u3 = User(first_name="Jane", last_name="Doe", email="gameboard@gmail.com", username="jane", password="password")
        u3.save()
        dob = datetime.datetime.strptime("2000-01-01", "%Y-%m-%d").date()
        player1 = Player(user=u1, date_of_birth=dob)
        player1.save()
        player2 = Player(user=u2, date_of_birth=dob)
        player2.save()
        player3 = Player(user=u3, date_of_birth=dob)
        player3.save()

        game1 = Game(name="Catan", description="You play this!")
        game1.save()
        game2 = Game(name="Bananagram", description="Spell words!")
        game2.save()
        game3 = Game(name="Uno", description="Reverse!")
        game3.save()

        group = Group(name="Webapps_Group")
        group.save()
        group.players.add(player1)
        group.players.add(player2)
        group.admins.add(player3)

        gameDate = datetime.datetime.strptime("2019-12-01", "%Y-%m-%d").date()
        played1 = Round(game=game1, date=gameDate, group=group)
        played1.save()
        played1.players.add(player1)
        played1.players.add(player2)
        played1.winners.add(player1)

        played2 = Round(game=game2, date=gameDate, group=group)
        played2.save()
        played2.players.add(player1)
        played2.players.add(player2)
        played2.players.add(player3)
        played2.winners.add(player1)
        played2.winners.add(player2)

        played3 = Round(game=game3, date=gameDate, group=group)
        played3.save()
        played3.players.add(player1)
        played3.winners.add(player1)

    def test_player(self):
        player = Player.objects.get(user__username="jeffx")
        dob1 = datetime.datetime.strptime("2000-01-01", "%Y-%m-%d").date()
        dob2 = datetime.datetime.strptime("2000-01-02", "%Y-%m-%d").date()

        self.assertEquals(player.user.first_name, "Jeff")
        self.assertEquals(player.user.password, "password")
        self.assertNotEqual(player.user.last_name, "Williams")
        self.assertNotEqual(player.user.email, "email")
        self.assertEquals(player.date_of_birth, dob1)
        self.assertNotEqual(player.date_of_birth, dob2)

    def test_game(self):
        game1 = Game.objects.get(name="Catan")
        game2 = Game.objects.get(name="Bananagram")
        game3 = Game.objects.get(description="You play this!")

        self.assertNotEqual(game1, game2)
        self.assertEqual(game1, game3)
        self.assertEqual(game1.description, "You play this!")

    def test_playergroup(self):
        group = Group.objects.get(name="Webapps_Group")
        player1 = Player.objects.get(user__username="keegan")
        player2 = Player.objects.get(user__username="john")
        player3 = Player.objects.get(user__username="jane")
        player4 = group.admins.first()
        
        self.assertEquals(player3, player4)
        self.assertIn(player1, group.players.all())
        self.assertIn(player2, group.players.all())
        self.assertNotIn(player1, group.admins.all())
        self.assertNotIn(player3, group.players.all())

    def test_game_played(self):
        player1 = Player.objects.get(user__username="keegan")
        player2 = Player.objects.get(user__username="john")
        player3 = Player.objects.get(user__username="jane")
        played1 = Round.objects.filter(players__user__username__exact=player1.user.username)
        played2 = Round.objects.filter(players__user__username__exact=player2.user.username)
        played3 = Round.objects.filter(players__user__username__exact=player3.user.username)

        self.assertEqual(len(played1), 3)
        self.assertEqual(len(played2), 2)
        self.assertEqual(len(played3), 1)

        game_played1 = Round.objects.get(game__name__exact="Catan")
        game_played2 = Round.objects.get(game__name__exact="Bananagram")
        game_played3 = Round.objects.get(game__name__exact="Uno")
        winners1 = game_played1.winners.all()
        winners2 = game_played2.winners.all()
        winners3 = game_played3.winners.all()

        self.assertEquals(player1, winners1.first())
        self.assertIn(player1, winners2)
        self.assertIn(player2, winners2)
        self.assertNotIn(player3, winners2)
        self.assertIn(player1, winners1)
        self.assertNotIn(player3, winners1)
        self.assertEquals(len(winners3), 1)

        players1 = game_played1.players.all()
        players2 = game_played2.players.all()
        players3 = game_played3.players.all()
        self.assertEquals(player1, players3.first())
        self.assertIn(player1, players2)
        self.assertIn(player2, players2)
        self.assertNotIn(player3, players3)
        self.assertIn(player1, players3)
        self.assertEquals(len(players3), 1)
        self.assertEquals(len(players2), 3)


class TestMenuServeFunctions(StaticLiveServerTestCase):
    """

    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.selenium = WebDriver()
        cls.selenium.implicitly_wait(10)
        cls.selenium.get('%s%s' % (cls.live_server_url, '/import'))
        try:
            element = WebDriverWait(cls.selenium, 20).until(
                EC.presence_of_element_located((By.ID, "register-btn"))
            )
        finally:
            pass

    @classmethod
    def tearDownClass(cls):
        cls.selenium.quit()
        super().tearDownClass()

    def test_all(self):
        # Test the index page
        self.selenium.get('%s%s' % (self.live_server_url, '/'))
        try:
            element = WebDriverWait(self.selenium, 2).until(
                EC.presence_of_element_located((By.ID, "register-btn"))
            )
        finally:
            pass
        self.assertTrue(self.selenium.find_element_by_id('register-btn').is_displayed())

        # register new user
        self.selenium.get('%s%s' % (self.live_server_url, '/register'))
        self.assertTrue(self.selenium.find_element_by_id('register-submit').is_displayed())
        username_input = self.selenium.find_element_by_name("register-username")
        username_input.send_keys('tester')
        first_input = self.selenium.find_element_by_name("register-first_name")
        first_input.send_keys('Test')
        last_input = self.selenium.find_element_by_name("register-last_name")
        last_input.send_keys('User')
        password_input = self.selenium.find_element_by_name("register-password")
        password_input.send_keys('WebAppsIsTheBestCourse')
        confirm_password_input = self.selenium.find_element_by_name("register-password_confirm")
        confirm_password_input.send_keys('WebAppsIsTheBestCourse')
        self.selenium.find_element_by_id('register-submit').click()
        self.assertTrue(self.selenium.find_element_by_id('logout-btn').is_displayed())

        # logout
        self.selenium.get('%s%s' % (self.live_server_url, '/logout'))

        # Login to user
        self.selenium.get('%s%s' % (self.live_server_url, '/login'))
        username_input = self.selenium.find_element_by_name("login-username")
        username_input.send_keys('Keegan')
        password_input = self.selenium.find_element_by_name("login-password")
        password_input.send_keys('WebAppsIsTheBestCourse')
        self.selenium.find_element_by_id('login-submit').click()
        self.assertTrue(self.selenium.find_element_by_id('logout-btn').is_displayed())

        # Try to edit name
        self.selenium.find_element_by_id('edit-profile-btn').click()
        self.assertTrue(self.selenium.find_element_by_id('id_last_name').is_displayed())
        last_input = self.selenium.find_element_by_id('id_last_name')
        last_input.send_keys('Williams')
        self.selenium.find_element_by_id('edit-submit').click()
        self.assertEqual(self.selenium.find_element_by_id('user-full-name').text, 'KEEGAN WILLIAMS')

        # Try to add game data
        self.selenium.get('%s%s' % (self.live_server_url, '/group'))
        self.assertEqual(self.selenium.find_element_by_id('group-name').text, 'TAS and Friends')
        self.selenium.find_element_by_id('add-round-btn').click()
        game_input = self.selenium.find_element_by_name("game")
        game_input.send_keys('Carcassone')
        player_input = self.selenium.find_element_by_name("player")
        player_input.send_keys('Keegan')
        player_input.send_keys(Keys.RETURN)
        player_input.send_keys(Keys.RETURN)
        self.selenium.find_element_by_id('li-1').click()
        self.selenium.find_element_by_name('submit').click()
        self.selenium.get('%s%s' % (self.live_server_url, '/group'))





