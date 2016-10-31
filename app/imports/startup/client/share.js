import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  window: {
    width: null
  },
  search: {
    searchText: ''
  },
  uploader: {
    uploads: new ReactiveArray
  },
  docx: {
    idSourceRendering: null
  }
});
