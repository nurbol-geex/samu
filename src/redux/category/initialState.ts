export const categoryInitialState: CategoryState = {
  pageContent: {
    id: '',
    sections: [
      {
        type: 'icon-grid',
        items: [
          {
            image: '',
            title: '',
            link: '',
            content: {type: 'product', id: ''},
          },
        ],
      },
    ],
  },
  collections: [],
  isLoading: false,
  error: null,
};
