from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path("login/", views.loginView, name="login"),
    path("logout/", views.logoutView, name="logout"),
    path("register/", views.register, name="register"),
    path("user/", views.userView, name="user"),
    path("profile/<str:username>/", views.profile, name="profile"),
    path("update-profile/", views.updateProfile, name="update-profile"),
    path("allSkills/", views.getSkills, name="allSkills"),
    re_path(r'^search/', views.searchResults, name="search"),
    path("dms/<str:otherUser>/", views.returnDm, name="dms"),
    path("openedDMs/", views.openedDms, name="openedDMs"),

    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
