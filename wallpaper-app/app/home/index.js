import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Modal, Button, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { theme } from '../../constants/theme'
import { wp, hp } from '../../helpers/common'
import { router } from 'expo-router'
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated'
import Categories from '../../components/categories'
import ImageGrid from '../../components/ImageGrid'
import { apiCall } from '../../api'
import { debounce } from "lodash"
import FiltersModal from '../../components/FiltersModal'


const HomeScreen = () => {

  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [filters, setFilters] = useState(null);
  const searchInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);
  let [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // var setPage(1);

  useEffect(() => {
    setPage(1);
    fetchImages();
  }, [])

  const fetchImages = async (params = { page }, append = false) => {
    setLoading(true);
    let res = await apiCall(params);
    console.log(params);

    if (res.success && res.data.hits) {
      if (append) {
        setImages(prevImages => [...prevImages, ...res.data.hits])
      }
      else {
        setImages([...res.data.hits])
      }
    }
    setLoading(false);
  }

  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    clearSearch();
    setSearch("");
    setPage(1);
    let params = {
      page: 1,
      ...filters
    }
    if (cat) {
      params.category = cat
    }
    fetchImages(params, false)
  }

  const handleSearch = (text) => {
    setSearch(text)
    setActiveCategory(null)
    if (text.length > 2) {
      // search
      setPage(1);

      fetchImages({ page: 1, q: text, ...filters }, false)

    }
    if (text === "") {
      setPage(1);
      setSearch();
      fetchImages({ page: 1, ...filters }, false)
      clearSearch();
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])


  const applyFilters = () => {

    if (filters) {
      setPage(1);
      setImages([]);
      let params = {
        page: 1,
        ...filters
      }
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  }
  const resetFilters = () => {
    if (filters) {
      setFilters(null);
      setPage(1);
      setImages([]);
      let params = {
        page: 1,
      }
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);

    }
    closeFiltersModal();
  }

  const clearThisFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz });
    setPage(1);
    setImages([]);
    let params = {
      page: 1,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);

  }
  const clearSearch = () => {
    setSearch("");
    searchInputRef.current.clear();
  }


  const openFiltersModal = () => {
    modalRef.current.present();
  }
  const closeFiltersModal = () => {
    modalRef.current.close();
  }


  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        const nextPage = page + 1;
        setPage(nextPage); 
        let params = {
          page: nextPage,
          ...filters,
        }
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;

        fetchImages(params, true);

        console.log("Bottom reached");
      }
    }
    else if (isEndReached) {
      setIsEndReached(false);
    }
  }

  const handleScrollUp = () => {
    scrollRef.current.scrollTo({
      y: 0,
      animated: true
    })
  }

  return (


    <Animated.View entering={FadeInUp.duration(500).springify()} style={[styles.container, { paddingTop }]}>

      {/* Header */}

      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>
            Ephemera
          </Text>
        </Pressable>

        <Pressable onPress={() => openFiltersModal()} >
          <FontAwesome6 name="bars-staggered" size={28} color={theme.colors.neutral(0.7)} />
        </Pressable>
      </View>

      {/* Body */}

      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={5}
        contentContainerStyle={{ gap: 15 }} >

        {/* Search Bar */}

        <View style={styles.searchBar} >
          <View style={styles.searchIcon}>
            <Feather name='search' size={24} color={theme.colors.neutral(0.5)} />
          </View>
          <TextInput placeholder='Search Here'

            onChangeText={handleTextDebounce}
            style={styles.searchInput}
            ref={searchInputRef}
          />
          {
            search && (<Pressable style={styles.closeIcon} onPress={() => handleSearch("")}
            >
              <Ionicons name="close" size={24} color={theme.colors.neutral(0.6)} />
            </Pressable>)
          }

        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
        </View>

        {/* Filters */}

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {
              filters && Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {
                      key == "colors" ? (
                        <View style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key]
                        }} />
                      )
                        : (
                          <Text style={styles.filterItemText}>{filters[key]}</Text>
                        )
                    }
                    <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)} >
                      <Ionicons name="close" size={14} color={theme.colors.neutral(0.9)} />
                    </Pressable>
                  </View>
                )
              })
            }
          </ScrollView>
        </View>


        {/* Image Grid (Masonry) */}

        <View>
          {images.length > 0 && <ImageGrid images={images} router={router} />}
        </View>

        {/* Loader */}

        <View style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}>
          {loading ? <ActivityIndicator size={"large"} /> : null}
        </View>

        {/* Filters Modal */}

        <FiltersModal
          modalRef={modalRef}
          filters={filters}
          setFilters={setFilters}
          onClose={closeFiltersModal}
          onApply={applyFilters}
          onReset={resetFilters}
        />

      </ScrollView >

    </Animated.View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),

  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    padding: 8,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9)
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  }


})


export default HomeScreen;