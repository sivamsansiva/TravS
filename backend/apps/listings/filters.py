import django_filters
from django.db import models as django_models
from .models import Listing


class ListingFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')
    user   = django_filters.NumberFilter(field_name='user__id')

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            django_models.Q(title__icontains=value) |
            django_models.Q(location__icontains=value) |
            django_models.Q(description__icontains=value)
        )

    class Meta:
        model  = Listing
        fields = ['search', 'user']
