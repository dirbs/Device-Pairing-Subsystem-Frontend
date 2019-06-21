export default {
  items: [
    {
      title: true,
      name: 'mainNavigation',
      wrapper: {            // optional wrapper object
          element: '',        // required valid HTML5 element tag
          attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
        id: 1,
        name: 'imsiRequestsLink',
        icon: 'fa fa-reply',
        url: '/imsi-requests'
    },
    {
        id: 2,
        name: 'bulkUploadLink',
        icon: 'fa fa-file-text-o',
        url: '/bulk-upload'
    },
    {
        id: 3,
        name: 'generatePairCodeLink',
        url: '/generate-pair-code',
        icon: 'fa fa-file-code-o',
    },
    {
        id: 4,
        name: 'searchRequestLink',
        url: '/search-requests',
        icon: 'fa fa-search',
    }
  ]
};
