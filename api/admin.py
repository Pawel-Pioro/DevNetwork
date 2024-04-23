from django.contrib import admin
from .models import Skill, Profile, Message, openedDM

# Register your models here.


admin.site.register(Skill)
admin.site.register(Profile)
admin.site.register(Message)

class openedDMAdmin(admin.ModelAdmin):
    readonly_fields = ('last_message',)
admin.site.register(openedDM, openedDMAdmin)