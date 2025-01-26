import os

from django import template

register = template.Library()

@register.filter
def get_file_extension(value):
    return os.path.splitext(value.name)[1]

@register.filter
def add(value, arg):
    try:
        return int(value) + int(arg)
    except (ValueError, TypeError):
        return str(value) + str(arg)

@register.filter
def mul(value, arg):
    try:
        return int(value) * int(arg)
    except (ValueError, TypeError):
        return str(value) * int(arg)

@register.filter
def add_class(value, arg):
    return value.as_widget(attrs={'class': arg})
    