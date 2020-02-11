from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Player(models.Model):
    """
    The player class stores information about individual players.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField(default=timezone.now().strftime("%Y-%m-%d"))
    profile_image = models.ImageField(upload_to='', blank=True)
    primary_group = models.ForeignKey("Group", blank=True, null=True, on_delete=models.CASCADE)
    favorite_game = models.ForeignKey("Game", blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user.username)


class Game(models.Model):
    """
    The game class is all of the information about individual games which are played by users. Games will be non-group
    specific. So if one group adds a game, it will then be available for all groups in the future.
    """
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=400)
    game_picture = models.ImageField(upload_to='', blank=True)

    def __str__(self):
        return str(self.name)


class Group(models.Model):
    """
    A player group is a group which users/players can create and invite other players too. This allows users to keep all
    of the friends the play games with in separate groups, and keep track of scores with those other players.
    """
    name = models.CharField(max_length=50)
    players = models.ManyToManyField(Player, related_name='players')
    admins = models.ManyToManyField(Player, related_name='admins')
    group_picture = models.ImageField(upload_to='', blank=True)

    def __str__(self):
        return str(self.name)


class Round(models.Model):
    """
    When a group plays a game, they will create a new instance of this class. This stores all of the relevant
    information about who played the game, who won, and the game played.
    """
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now().strftime("%Y-%m-%d"))
    winners = models.ManyToManyField(Player, related_name='game_winners')
    players = models.ManyToManyField(Player, related_name='game_players')
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return str("{}, {}: {}, {}".format(self.game, self.date, self.players.all(), self.winners.all()))


class StatisticType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    unit = models.CharField(max_length=50)


class StatisticInfo(models.Model):
    date = models.DateField()
    type = models.ForeignKey(StatisticType, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)


class Statistic(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    value = models.DecimalField(decimal_places=2, max_digits=16)
    info = models.ForeignKey(StatisticInfo, on_delete=models.CASCADE)
