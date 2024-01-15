export const originalFields = {
  alert_new_status_updated_at: {
    field: 'alert_new_status_updated_at',
    isSort: true,
    sortType: 'desc',
  },
};

export const bodyRequest: any = {
  limit: 20,
  page: 1,
  filter: {
    like: {
      id_or_name: '',
    },
  },
  sort: {
    attribute: 'alert_new_status_updated_at',
    type: 'desc',
  },
};
