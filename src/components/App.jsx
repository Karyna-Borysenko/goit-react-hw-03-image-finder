import React from 'react';
import { animateScroll as scroll } from 'react-scroll';

import toast, { Toaster } from 'react-hot-toast';

import { fetchImages } from './PixabayAPI';
import Searchbar from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';

import { Text } from './App.styled';

class App extends React.Component {
  state = {
    images: [],
    input: '',
    page: 1,
    loading: false,
    visibleLoadMore: false,
  };

  async componentDidUpdate(_, prevState) {
    if (
      prevState.input !== this.state.input ||
      prevState.page !== this.state.page
    ) {
      try {
        this.setState({ loading: true });

        const foundImages = await fetchImages(
          this.state.input,
          this.state.page
        );

        this.setState(prevState => ({
          images: [...prevState.images, ...foundImages.hits],
          loading: false,
          visibleLoadMore: this.state.images.length !== foundImages.totalHits,
        }));

        if (foundImages.hits.length === 0) {
          toast('No pictures with this title', {
            icon: '😢',
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  //----Записываем значение при отправке----
  handleFormSubmit = input => {
    this.setState({ input, page: 1, images: [] });
  };

  //----Загрузить ещё----
  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
    scroll.scrollToBottom();
  };

  //----Рендер----
  render() {
    const { input, loading, images, visibleLoadMore } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.handleFormSubmit} />

        {!input && <Text>Enter image name, please!</Text>}

        {!loading && images && <ImageGallery images={images} />}

        {loading && <Loader loading={loading} />}

        {visibleLoadMore && <Button onClick={this.loadMore} />}

        <Toaster position="top-right" />
      </>
    );
  }
}

export default App;
