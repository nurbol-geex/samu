// global.d.ts

import {APIMethods} from '../APIMethods';
import {apiHandler} from '../apiHandler';
import {GetSearchResponse} from './types';
import {Address} from '../phoneConfirmAPI/types';
import {SvgProps} from 'react-native-svg';
import {User} from '../phoneConfirmAPI/types';
import {SignUpRequestBody} from '../signUpAPI/types';
import {getBaseUrlFromStorage} from 'src/utils/SetENV';

declare global {
  // function getProductSearchByStoreIdAPI(
  //   searchValue?: string,
  //   storeId?: string,
  // ) {
  //   return apiHandler<GetSearchResponse>({
  //     method: APIMethods.GET,
  //     url: `${getBaseUrlFromStorage()}/user/search/product/store/${storeId}?keyword=${searchValue}`,
  //   });
  // }

  interface userInitialStateUserState
    extends SignUpRequestBody,
      LoginWithEmailResponseBody {
    uuid?: string;
    user?: User;
    addressForm?: Omit<Address, '_id'>;
    id?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    isLoggedIn?: boolean;
    authenticationType?: AuthenticationType | undefined;
    updateDone?: boolean;
    deleteDone?: boolean;
    verifiedPhone?: string;
    resetPasswordRequested?: string | boolean;
    isLoading?: boolean;
    searchKey?: string;
    error?: Error | null | string;
    isGuest?: boolean;
    updateProfileData?: any;
    isUpdateProfileLoading?: boolean;
    isSubmitIssue?: boolean
    updateProfileError?: Error | null | string;
    isSelectHelpIsLoading?:boolean;
    lat:any;
    lng:any;

  }

  interface ProductDetailsValue {
    name?: string;
    id?: string;
    additionalPrice?: number;
  }

  type OptionType = 'single' | 'multiple';

  interface ProductDetailsOption {
    name?: string;
    type?: OptionType;
    min?: number;
    max?: number;
    values?: ProductDetailsValue[];
    id?: string;
  }

  interface IStoreProductDetails {
    name?: string;
    price?: number;
    images?: {originalUrl?: string}[];
    options?: ProductDetailsOption[];
    description?: string;
  }

  interface RouteParams {
    productId?: string;
    storeId?: string;
  }

  interface ProductDetailsProps {
    route?: {params?: RouteParams};
  }

  interface ISvgProps extends SvgProps {
    style?: ViewStyle;
  }

  interface RateBarProps {
    rate?: number;
    followers?: string;
    deliveryCost?: number;
  }

  interface ProductCardProps {
    item?: ProductItems;
    storeAddress?: Address;
    storeName?: string;
    storeId?: string;
    deliveryTime?:string
  }

  interface StoreProductsProps {
    item?: ProductItems;
    navigation?: {
      navigate?: (
        route?: string,
        params?: {productId?: string; storeId?: string},
      ) => void;
    };
    storeId?: string;
    storeDetailsData?: {
      name?: string;
      address?: Address;
    };
  }

  interface Value {
    name?: string;
    id?: string;
    additionalPrice?: number;
  }

  type OptionType = 'single' | 'multiple';

  interface Option {
    name?: string;
    type?: OptionType;
    min?: number;
    max?: number;
    values?: Value[];
    id?: string;
  }

  interface OptionItemProps {
    item?: Option;
    selectedOptions?: string[];
    handleSelect?: (optionId?: string, valueId?: string) => void;
  }

  interface Styles {
    closeText?:TextStyle;
    closedOverlay?: ViewStyle;
    sublabel?:TextStyle;
    logo?: ImageStyle;
    getStartedButton?: ViewStyle;
    emailOrPhoneInput?: ViewStyle;
    passwordInput?: ViewStyle;
    continueWithEmailOrPhoneButton?: ViewStyle;
    forgot?: ViewStyle;
    inputsLabel?: TextStyle;
    addButtonView?: ViewStyle;
    ratingView?: ViewStyle;
    singleProductContainer?: ViewStyle;
    singleProductDetails?: ViewStyle;
    storeDetailsContainer?: ViewStyle;
    storeDetails?: ViewStyle;
    browseTitle?: TextStyle;
    browseContainer?: ViewStyle;
    categoryContainer?: ViewStyle;
    categoryImageContainer?: ViewStyle;
    categoryImage?: ImageStyle;
    categoryText?: TextStyle;
    elevation2?: ViewStyle;
    elevation4?: ViewStyle;
    elevation8?: ViewStyle;
    elevation16?: ViewStyle;
    elevation24?: ViewStyle;
    inputContainer?: ViewStyle;
    iconContainer?: ViewStyle;
    modalBtn?: ViewStyle;
    eyeIcon?: TextStyle;
    startButton?: ViewStyle;
    endButton?: ViewStyle;
    endButtonIcon?: ImageStyle;
    imageStyle?: ImageStyle;
    titleContainer?: ViewStyle;
    price?: TextStyle;
    addButton?: TextStyle;
    addButtonText?: TextStyle;
    touchable?: ViewStyle;
    contentContainer?: ViewStyle;
    topSide?: ViewStyle;
    shopImage?: ImageStyle;
    shopDetail?: ViewStyle;
    shopBtn?: TextStyle;
    shopBtnLabel?: TextStyle;
    shopClickBtn?: TextStyle;
    flatListStyle?: ViewStyle;
    rate?: TextStyle;
    item_text?: TextStyle;
    modalContainer?: ViewStyle;
    modalBody?: ViewStyle;
    modalTitle?: TextStyle;
    modalText?: TextStyle;
    modalButton?: ViewStyle;
    radioLabelContainer?: ViewStyle;
    cancelButton?: ViewStyle;
    iconSize?: ImageStyle;
    itemLeftContainer?: ViewStyle;
    nameContainer?: ViewStyle;
    addressSelectButton?: ViewStyle;
    radioButtonContainer?: ViewStyle;
    activeRadioButton?: ViewStyle;
    selectedRadioButton?: ViewStyle;
    addressIconContainer?: ViewStyle;
    autocompleteListViewStyle?: ViewStyle;
    dditionalInputContainer?: ViewStyle;
    deliveryInput?: ViewStyle;
    saveButton?: ViewStyle;
    inputStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    item?: ViewStyle;
    dropdownLabel?: TextStyle;
    dropdownPicker?: ViewStyle;
    datePickerContainer?: ViewStyle;
    datePickerButton?: ViewStyle;
    errorText?: TextStyle;
    input?: ViewStyle;
    dropdownplaceholder?: ViewStyle;
    continueButton?: ViewStyle;
    footerContainer?: ViewStyle;
    linkGroup?: ViewStyle;
    linkItem?: ViewStyle;
    lastItem?: ViewStyle;
    cardContainer?: ViewStyle;
    detailContainer?: ViewStyle;
    riderImage?: ImageStyle;
    bookNowBtn?: ViewStyle;
    descriptionText?: ViewStyle;
    bookNowText?: ViewStyle;
    categoriesButton?: ViewStyle;
    imageContainer?: ViewStyle;
    categoriesImage?: ImageStyle;
    carouselButtonText?: TextStyle;
    mainContainer?: ViewStyle;
    card?: ViewStyle;
    tabContainer?: ViewStyle;
    loadingContainer?: ViewStyle;
    exploreButton?: ViewStyle;
    container?: ViewStyle;
    indicator?: ViewStyle;
    pagerContentView?: ViewStyle;
    pagerContainer?: ViewStyle;
    storeCard?: ViewStyle;
    storeCardDetailsContainer?: ViewStyle;
    storeTimerContainer?: ViewStyle;
    timerContainer?: ViewStyle;
    ratings?: ViewStyle;
    header?: ViewStyle;
    shareButton?: ViewStyle;
    bottomView?: ViewStyle;
    keyboardAvoidingView?: ViewStyle;
    scrollViewContentContainer?: ViewStyle;
    emailInput?: ViewStyle;
    googleButton?: ViewStyle;
    appleButton?: ViewStyle;
    otherOptions?: ViewStyle;
    loginNowRow?: ViewStyle;
    shadow?: ViewStyle;
    email?: ViewStyle;
    btnContainer?: ViewStyle;
    onboardingImage?: ImageStyle;
    exploreButtonImage?: ImageStyle;
    storeImage?: ImageStyle;
    ratingImage?: ImageStyle;
    mapPointer?: ImageStyle;
    orText?: TextStyle;
    exploreButtonText?: TextStyle;
    storeTitle?: TextStyle;
    title?: TextStyle;
    description?: TextStyle;
    cardText?: TextStyle;
    text?: TextStyle;
    loginNowLabel?: TextStyle;
    loginNow?: TextStyle;
    continueAsGuest?: TextStyle;
    chipButton?: ViewStyle;
    chipImage?: ImageStyle;
    dropdown?: ViewStyle;
    dropdownContainer?: ViewStyle;
    dropdownInnerContainer?: ViewStyle;
    label?: TextStyle;
    arrowIcon?: ViewStyle;
    image?: ImageStyle;
  }

  interface FormValues {
    geometry?: object[];
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    emailOrPhone?: string;
    password?: string;
    confirmationPassword?: string;
    street?: string;
    unit?: string;
    province?: string;
    city?: string;
    zip?: string;
    country?: string;
    typeOfPlace?: string;
    deliveryNotes?: string;
    gender?: string;
    dateOfBirth?: string | null;
    oldPassword?: string;
    newPassword?: string;
    repeatPassword?: string;
  }

  interface ProductDetailsHeaderProps {
    storeProductDetailsData?: IStoreProductDetails;
    activeIndex?: number;
    setActiveIndex?: (index?: number) => void;
  }

  interface MapViewProps {
    lat?: number;
    lng?: number;
    zoomLevel?: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
    containerStyle?: ViewStyle;
    draggable?: boolean;
    orderDetails?: object
    zoomEnabled?: boolean
  }

  interface StoreType {
    id?: string;
    name?: string;
    // Add other properties as needed
  }

  interface ITags {
    tags?: string[];
  }

  interface SectionType {
    type?: string;
    title?: string;
    stores?: StoreType[];
    query?: ITags;
  }

  interface HeaderSectionProps {
    section?: SectionType;
    containerStyle?: ViewStyle;
  }

  interface AllStoresCardProps {
    item?: StoreItems;
  }

  interface ExploreCardProps {
    item?: ProductGridItem;
  }

  interface ChipSectionProps {
    // item?: CarouselItem;
    text?: string;
  }

  interface ShopCardProps {
    item?: StoreItems;
  }

  interface ShopProductsCardProps {
    item?: StoreItems;
  }

  interface Tip {
    price?: number;
    id?: number;
  }

  interface CustomHeaderProps {
    title?: string;
    containerStyle?: StyleProp<ViewStyle> | undefined;
    titleStyle?: StyleProp<TextStyle> | undefined;
    startButtonIconType?: StartButtonIconType;
    containerBackgroundColor?: string;
    titleColor?: string;
    searchKey?: string;
    endButtonIconType?: string;
    handleSearch?: () => void;
    shareHandler?: () => void;
    handleBack?: () => void;
  }

  interface CustomModalProps {
    isVisible?: boolean;
    containerStyle?: ViewStyle;
    cancelButtonStyle?: ViewStyle;
    okButtonStyle?: ViewStyle;
    title?: string;
    titleStyle?: TextStyle;
    children?: ReactNode;
    okText?: string;
    cancelText?: string;
    onOk?: () => void;
    okBtnColor?: string;
    onCancel?: () => void;
    onModalHide?: () => void;
    hideYesNoButton?: boolean;
    okBtnLoading?: boolean;
    buttonVariant?:any
  }

  interface CustomLinkProps {
    type?: LinkType | undefined;
    testID?: string;
    onPress?: (event?: GestureResponderEvent) => void;
    text?: string;
    style?: StyleProp<ViewStyle>;
  }

  interface CustomHintTextProps {
    message?: string;
    numberOfLines?: number | undefined;
    containerStyle?: StyleProp<ViewStyle> | undefined;
  }

  interface CustomTouchableSVGProps {
    children?: ReactNode;
    onPress?: () => void;
    containerStyle?: StyleProp<ViewStyle> | undefined;
    disabled?: boolean;
  }

  interface CustomButtonProps {
    testID?: string;
    onPress?: (
      event?: GestureResponderEvent | React.BaseSyntheticEvent | undefined,
    ) => void | Promise<void>;
    containerStyle?: StyleProp<ViewStyle> | undefined;
    style?: StyleProp<TextStyle> | undefined;
    text?: string;
    disabled?: boolean;
    active?: boolean;
    touchableBackgroundColor?: string;
    textColor?: string;
    IconComponent?: ReactElement;
    hasBackView?: boolean;
    btnContainerStyle?: StyleProp<ViewStyle> | undefined;
    loading?: boolean;
    loadingColor?: string;
  }

  interface TimeBarProps {
    hours?: string;
    distance?: string;
  }

  interface FilterTabsBoardProps {
    tabs?: tab[];
    onChange?: (value?: string) => void;
    dropdown?: tab[];
  }

  interface BannerSectionProps {
    item?: BannerItems[];
    homeScreen?: boolean;
  }

  interface ContainerStyle {
    containerStyle?: StyleProp<ViewStyle> | undefined;
    activePage?: number;
    pages?: any[];
  }

  interface StoreSectionProps {
    item?: StoreItems;
    id?: string;
    cardStyle?: ViewStyle;
 
  }

  interface PagerItemProps {
    item?: {
      id?: number;
      image?: any;
      title?: string;
      description?: string;
    };
  }

  interface CategorySectionProps {
    item?: CarouselItem;
    bgColor?: string;
    containerStyle?: ViewStyle;
    imageContainerStyle?: ViewStyle;
    imageStyle?: ImageStyle;
    titleStyle?: TextStyle;
  }

  interface CustomRadioLabelProps {
    address?: string;
    city?: string;
  }

  interface CustomTextProps {
    text?: string | number | Error | null | ReactElement;
    text2?: string | number | ReactElement;
    variant?: TextVariant;
    testID?: string;
    style?: StyleProp<ViewStyle> | StyleProp<TextStyle> | undefined;
    textColor?: string;
    onPress?: (event?: GestureResponderEvent) => void;
    numberOfLines?: number;
  }

  interface CustomTabButtonProps {
    active?: boolean;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    text?: string;
    icon?: string;
    iconPosition?: 'left' | 'right';
    iconStyle?: ImageStyle;
  }

  interface CustomStatusBarProps {
    containerStyle?: ViewStyle;
    backgroundColor?: string;
  }

  interface CardDetails {
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvc?: string;
  }

  interface OrderState {
    // get all payments methods
    getAllPaymentMethodsData?: any;
    isAllPaymentMethodsLoading?: boolean;
    getAllPaymentMethodsError?: Error | null;

    // setup payment charge
    paymentChargeData?: any;
    isPaymentChargeLoading?: boolean;
    paymentChargeError?: Error | null;

    //  setup checkout order
    checkoutData?: any;
    isCheckoutDataLoading?: boolean;
    checkoutDataError?: Error | null;

    //  add new payment method
    addNewPaymentMethodData?: any;
    isAddNewPaymentMethodLoading?: boolean;
    addNewPaymentMethodError?: Error | null;

    //  setup default payment
    paymentDefaultData?: any;
    isPaymentDefaultLoading?: boolean;
    paymentDefaultError?: Error | null;

    //  update payment method
    upadtePaymentMethodData?: any;
    isUpadtePaymentMethodLoading?: boolean;
    upadtePaymentMethodError?: Error | null;

    // order verified
    orderVerifiedData?: any;
    isOrderVerifiedLoading?: boolean;
    orderVerifiedError?: Error | null;

    //  get order details
    getOrderDetailsData?: any;
    isGetOrderDetailsLoading?: boolean;
    getOrderDetailsError?: Error | null;

    // get all order
    getAllOrdersData?: any;
    isGetAllOrdersLoading?: boolean;
    getAllOrdersError?: Error | null;
    //  cancel order
    cancelOrderData?: any;
    isCancelOrderLoading?: boolean;
    cancelOrderError?: Error | null;

    // card details

    cardDetails?: CardDetails[];

    orderId?: string;
  }

  interface CartState {
    //product add cart
    productAddToCartData?: any;
    isProductAddToCartLoading?: boolean;
    productAddToCartError?: Error | null;

    // product get cart
    productGetCartData?: any;
    isProductGetCartLoading?: boolean;
    productGetCartError?: Error | null;

    //product update cart
    productUpdateCartData?: any;
    isProductUpdateCartLoading?: boolean;
    productUpdateCartError?: Error | null;

    //address cart update
    updateCartAddressData?: any;
    isUpdateCartAddressLoading?: boolean;
    updateCartAddressError?: Error | null;

    // save local cart
    items?: any;
    totalPrice?: number;
  }

  interface CustomTextInputProps extends TextInputProps {
    subLabel?: string;
    testID?: string;
    type?: InputType | undefined;
    value?: string | undefined;
    onChange?: (val?: string) => void;
    placeholder?: string;
    isPasswordVisible?: boolean;
    setIsPasswordVisible?: () => void;
    containerStyle?: StyleProp<ViewStyle> | undefined;
    placeholderPosition?: PlaceholderPosition | undefined;
    onBlur?: () => void | undefined;
    error?: GlobalError | undefined;
    hasBorderBottom?: boolean;
    textVariant?: TextVariant;
    inputStyle?: StyleProp<ViewStyle> | undefined;
    label?: string;
    inputBackgroundColor?: string;
    containerMarginHorizontal?: number;
    maxLength?: number | undefined;
    setRef?: (ref?: TextInput | null) => void | undefined;
    keyboardType?: KeyboardTypeOptions | undefined;
    inputDisable?: boolean;
    onFocus?: () => void | null;
    onPressIcon?: () => void | null;
    inputContainerStyle?: ViewStyle;
  }

  interface App {}

  interface AppState {
    app?: App;
    isLoading?: boolean;
    error?: Error | null;
  }

  interface CategoryState {
    pageContent?: PageContent;
    collections?: Collection[];
    isLoading?: boolean;
    error?: Error | null;
  }

  interface HomeState {
    homeSectionData?: any;
    isHomeLoading?: boolean;
    homeError?: Error | null;
    productGridData?: any;

    // explore
    exploreSectionData?: any;
    isExploreLoading?: boolean;
    exploreError?: Error | null;

    // search
    productSearchData?: any;
    isProductSearchLoading?: boolean;
    productSearchError?: Error | null;

    // store Details
    storeDetailsData?: any;
    isStoreDetailsLoading?: boolean;
    storeDetailsError?: Error | null;

    // store Menu
    storeMenuData?: any;
    isStoreMenuLoading?: boolean;
    storeMenuError?: Error | null;

    // store Product
    storeProductData?: any;
    isStoreProductLoading?: boolean;
    storeProductError?: Error | null;

    // store Product Details
    storeProductDetailsData?: any;
    isStoreProductDetailsLoading?: boolean;
    storeProductDetailsError?: Error | null;

    isProductByStoreIdLoading?: boolean;
    productByStoreIdData?: any;

    searchStoresData?: any;
    isSearchStoresLoading?: boolean;
    searchStoresError?: Error | null;

    //recent searches persist
    recentSearchData?: any;
  }

  interface ReportIssueOrder {
    orderNumber?: string;
    currentStatus?: 'completed' | 'cancelled' | 'processed';
    createdAt?: string;
    total?: number;
  }

  interface ReportIssueUserState {
    accessToken?: string;
  }

  interface RecentSearchesProps {}

  interface Order {
    id?: number;
    name?: string;
    orderNumber?: number;
    createdAt?: string;
    currentStatus?: string;
    total?: number;
    // Add other relevant fields
  }

  interface OrdersData {
    orders?: Order[];
    totalCount?: number;
  }

  interface OrdersState {
    ordersData?: OrdersData;
    completedOrdersData?: OrdersData;
    cancelledOrdersData?: OrdersData;
    loading?: boolean;
    error?: string | null; // Ensure the error is a serializable value
  }

  interface FetchOrdersParams {
    page?: number;
    pageSize?: number;
    status?: string | null;
    sortBy?: string;
  }

  interface FetchOrdersResponse {
    orders?: Order[];
    totalCount?: number;
  }

  interface ReviewAllOrderResponse {
    message?: string;
  }

  interface IReview {
    star: number;
    tags: string[];
    content: string;
  }

  interface IProductReview extends IReview {
    productId: string;
  }

  interface ReviewAllOrderParams {
    orderId?: string;
    storeId?: string;
    driverId?: string;
    driverReview?: IReview;
    storeReview?: IReview;
    productReviews?: IProductReview[];
  }

  interface RatingScreenProps {
    route: {
      params: ReviewOrderParams;
    };
  }

  interface RatingItemProps {
    imageSource: ImageSourcePropType;
    name: string;
    selectedRating: number;
    onStarPress: (rating: number) => void;
    hideStars: boolean;
  }

  interface routeParams {
    name?: string;
  }

  interface tabNavigatorProps {
    route?: routeParams;
  }

  interface tabIconProps {
    focused?: boolean;
  }

  interface Settings {}

  interface SettingState {
    isOnBoard?: boolean;
  }

  interface AddressEditScreenParams {
    addressId?: string;
  }

  interface AddressScreenParams {
    createFromAccount?: boolean;
  }

  interface AddNewCardScreenProps {
    route?: {
      params?: {
        orderData?: any;
        changeCard?: boolean;
      };
    };
    navigation?: {
      goBack?: () => void;
    };
  }

  // interface MenuItem {
  //   id?: number;
  //   name?: string;
  //   productCount?: number;
  // }

  interface StoreDetailsProps {
    route?: {params?: {storeId?: string}};
  }

  interface NavigationProps {
    navigate?: (
      screen?: string,
      params?: {orderId?: string} | undefined,
    ) => void;
  }

  // interface RadioButtonProps {
  //   street?: string;
  //   city?: string;
  // }

  interface SelectAddressModalProps {
    isVisible?: boolean;
    setVisible?: (arg?: boolean) => void;
    onAddNewAddressPress?: (arg?: any) => void;
    hideButton?: boolean;
    handleUdpatedAddress?: () => void;
    deliveryAddress?: object;
  }

  interface SliderItem {
    _id?: string;
    title?: string;
    subTitle?: string;
    image?: string;
  }
  interface HeaderComponentProps {
    navigation?: any;
    storeDetailsData?: any;
    storeDetailsDataLoading?: boolean;
    setShowMenu?: React.Dispatch<React.SetStateAction<boolean>>;
    handleSearch?: () => void;
  }

  interface StoreAddressProps {
    deliveryAddress?: string;
    deliveryInstructions?: string;
    showTimer?: boolean;
    containerStyle?: ViewStyle;
    rowStyle?: ViewStyle;
    textStyle?: TextStyle;
  }

  interface ShopDetailCardProps {
    shopName?: string;
    address?: string;
    buttonOnPress?: any;
  }

  interface BasketCardProps {
    item?: ItemType;
    isBorderLess?: boolean;
  }

  interface ItemType {
    productId?: string;
    name?: string;
    price?: number;
    image?: string;
    quantity?: number;
    productOptionValueIds?: string[];
    cartProductItemId?: string;
    cartId?: string;
    productExtraOptions?: [];
    storeId?: string;
    deliveryAddress?: {};
    storeName?: string;
    storeAddress?: {};
  }

  interface PaymentOptionProps {
    paymentOptions?: {
      id?: string;
      image?: string;
      isDefault?: boolean;
      channel?: string;
      isIcon?: boolean;
      icon?: ReactElement;
      card?: {
        cardBrand?: string;
        last4?: string;
      };
    };
    selectedOption?: string;
    handleOptionSelect?: (id?: string) => void;
  }

  interface TipModalProps {
    tipModalVisible?: boolean;
    setTipModalVisible?: Dispatch<React.SetStateAction<boolean>>;
    selectTip?: any;
    setSelectTip?: Dispatch<React.SetStateAction<number>>;
  }

  interface CustomCountProps {
    containerStyle?: ViewStyle;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
    increaseCartHandler?: () => void;
    decreaseCartHandler?: () => void;
    productCount?: number;
  }

  interface NoteModalProps {
    noteModalVisible?: boolean;
    setNoteModalVisible?: Dispatch<React.SetStateAction<boolean>>;
    storeNote?: string;
    setStoreNote?: Dispatch<React.SetStateAction<string>>;
  }

  interface StoreHelpProps {
    title?: string;
    btnText?: string;
    containerStyle?: ViewStyle;
    btnStyle?: ViewStyle;
    onPress?: () => void;
  }

  interface MenuItem {
    title?: string;
    data?: object[];
  }

  interface StoreMenuSheetProps {
    isVisible?: boolean;
    setShowMenu?: (visible?: boolean) => void;
    storeMenuDataLoading?: boolean;
    storeMenuData?: MenuItem[];
    onCategorySelect?: (val?: object) => void;
    selectedCategory?: string | null;
    storeDetailsData?: any;
  }

  interface StoreContactProps {
    onPress?: () => void;
    logoText?: string;
    logoDesc?: string;
    logo?: ImageSourcePropType;
    logoTextStyle?: string | undefined;
    logoDescStyle?: string;
    btnStyle?: ViewStyle;
    containerStyle?: ViewStyle;
    logoStyle?: ImageStyle;
    icon?: ImageSourcePropType;
    iconStyle?: ImageStyle;
    SvgShowing?: boolean;
    showCallIcon?: boolean;
    handleIcon?: () => void;
  }

  interface PriceCardProps {
    title?: string;
    price?: number;
    containerStyle?: object;
    titleStyle?: object;
    priceStyle?: object;
  }

  interface HomeHeaderProps {
    onPressAddressBar?: () => void;
    selectedAddress?: any;
    inputDisable?: boolean;
    setSearchingEnabled?: () => void;
  }

  interface SearchBarProps {
    value?: string;
    onChangeText?: (txt?: string) => void;
    placeholder?: string;
    inputDisable?: boolean;
    onFocus?: any;
  }

  interface TipOptionProps {
    setTipModalVisible?: Dispatch<React.SetStateAction<boolean>>;
    setSelectTip?: Dispatch<React.SetStateAction<number>>;
    selectTip?: number;
  }

  interface YourExperienceProps {
    title?: string;
    btnText?: string;
    containerStyle?: ViewStyle;
    btnStyle?: ViewStyle;
    reportOnPress?: () => void;
    ratingOnPress?: () => void;
  }

  interface CreateAddressRequestBody {
    name?: string;
    primary?: boolean;
    street?: string;
    unit?: string;
    city?: string;
    zip?: string;
    province?: string;
    country?: string;
    geometry?: string;
    typeOfPlace?: string;
    deliveryNotes?: string;
  }

  interface CreateAddressResponseBody {
    message?: string;
  }

  interface CreateAddressErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type CreateAddressResponse =
    | CreateAddressResponseBody
    | CreateAddressErrorBody;

  interface Response {
    sections?: Section[];
  }

  type Section =
    | ItemCarousel
    | ProductCollectionGrid
    | StoreCarousel
    | BannerItems;

  interface ItemCarousel {
    type?: 'item-carousel';
    style?: 'badge';
    items?: CarouselItem[];
  }

  interface ProductCollectionGrid {
    type?: 'product-collection-grid';
    style?: 'icon';
    items?: ProductItem[];
  }

  interface StoreCarousel {
    type?: 'store-carousel';
    title?: string;
    stores?: StoreItems[];
    query?: {tags?: string[]};
  }

  interface CarouselItem {
    title?: string;
    icon?: string;
    link?: string;
  }

  interface ProductItem {
    title?: string;
    icon?: string;
    query?: {tags?: string[]};
  }

  interface StoreItems {
    status?: 'auto' | 'unlisted' | 'open' | 'closed';
    name?: string;
    address?: Address;
    icon?: string;
    distance?: number;
    _id?: string;
    rating?: number;
    averageRating?: number;
    deliveryCharge?: number;
    deliveryCost?: number;
    estimatedDeliveryTime?: {
      min?: number;
      max?: number;
    };
    deliveryTime?: {
      min?: number;
      max?: number;
    };
    estimateDeliveryTime?: {
      min?: number;
      max?: number;
    };
  }
  interface BannerItems {
    image?: {originalUrl?: string};
  }

  interface Address {
    street?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
  }

  interface ApiError {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type GetHomeResponse = Response | ApiError;

  type PageContentId = string;

  interface PageContent {
    id?: PageContentId;
    sections?: AnyPageSection[];
  }

  type PageSectionType =
    | 'image-carousel'
    | 'image-slider'
    | 'image-banner'
    | 'icon-grid'
    | 'product-carousel';

  type AnyPageSection =
    | ImageCarouselPageSection
    | ImageSliderPageSection
    | ImageBannerPageSection
    | IIconGridPageSection
    | ProductCarouselPageSection;

  const Vendor: string = 'vendor';
  const Product: string = 'product';
  const Collection: string = 'collection';
  interface IconGridPageSectionItemContent {
    type?: string; // 'vendor' | 'product' | 'collection'
    id?: string;
  }

  interface IconGridPageSectionItem {
    image?: string;
    title?: string;
    link?: string;
    content?: IconGridPageSectionItemContent;
  }

  const IconGrid: string = 'icon-grid';
  interface IIconGridPageSection {
    type?: string; // 'icon-grid'
    items?: IconGridPageSectionItem[];
  }

  interface ImageComponent {
    title?: string;
    subtitle?: string;
    media?: string;
    link?: string;
  }

  interface ImageCarouselPageSection {
    type?: 'image-carousel';
    items?: ImageComponent[];
  }

  interface ImageSliderPageSection {
    type?: 'image-slider';
    items?: ImageComponent[];
  }

  interface ImageBannerPageSection {
    type?: 'image-banner';
    image?: ImageComponent;
  }

  interface ProductCarouselPageSection {
    type?: 'product-carousel';
    title?: string;
    query?: string;
  }

  type imageItem = {
    id?: string;
    type?: string;
    ext?: string;
    classification?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    dimensions?: {
      height?: number;
      width?: number;
      ratio?: number;
      length?: number;
    };
    isPublic?: boolean;
    owner?: string;
    viewers?: string[];
    uploadId?: string;
  };

  type Vendor = {
    id?: string;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    imageId?: imageItem;
  };

  type Collection = {
    id?: string;
    title?: string;
    subtitle?: string;
    imageId?: imageItem;
    vendorId?: Vendor;
    productsCount?: number;
  };

  type Store = {
    vendorId?: Vendor;
    status?: string;
    name?: string;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      country?: string;
      zip?: string;
    };
    hours?: {
      tz?: string;
      monday?: {
        opensAt?: number;
        closesAt?: number;
      };
      tuesday?: {
        opensAt?: number;
        closesAt?: number;
      };
      wednesday?: {
        opensAt?: number;
        closesAt?: number;
      };
      thursday?: {
        opensAt?: number;
        closesAt?: number;
      };
      friday?: {
        opensAt?: number;
        closesAt?: number;
      };
      saturday?: {
        opensAt?: number;
        closesAt?: number;
      };
      sunday?: {
        opensAt?: number;
        closesAt?: number;
      };
    };
    cancelationPolicy?: string;
    id?: string;
    image?: imageItem;
  };

  interface BrowsePageResponseBody {
    json(): unknown;
    collections?: Collection[];
    stores?: Store[];
  }

  interface Device {
    uuid?: string;
    ip?: string;
    ua?: string;
  }

  interface PhoneConfirmRequestBody {
    phone?: string;
    code?: string;
    uuid?: string;
    device?: Device;
  }

  interface UserState {
    addresses?: Address[];
    isLoading?: boolean;
    error?: string | null;
    selectedAddress?: Address;
    primaryAddress?: Address;
  }

  interface Address {
    // geometry?: any;
    geometry?: {
      latitude?: number;
      longitude?: number;
    };
    _id?: string;
    name?: string;
    primary?: boolean;
    street?: string;
    street2?: string;
    unit?: string;
    city?: string;
    zip?: string;
    province?: string;
    country?: string;
    typeOfPlace?: string;
    deliveryNotes?: string;
  }

  interface User {
    addresses?: Address[];
    isSuspended?: boolean;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    email?: string;
    phone?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    createdAt?: string;
    upstringdAt?: string;
    id?: string;
  }

  interface PhoneConfirmResponseBody {
    accessToken?: string;
    user?: User;
  }

  interface PhoneConfirmErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type PhoneConfirmResponse = PhoneConfirmResponseBody | PhoneConfirmErrorBody;

  interface DeleteAccountResponseBody {
    message?: string;
  }
  interface Analytics {
    
  }

  interface DeleteAccountErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type DeleteAccountResponse =
    | DeleteAccountResponseBody
    | DeleteAccountErrorBody;

  interface UpdateProfileResponseBody {
    message?: string;
  }

  interface UpdateProfileErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type UpdateProfileResponse =
    | UpdateProfileResponseBody
    | UpdateProfileErrorBody;

  interface Response {
    stores?: StoreItems[];
  }

  interface StoreItems {
    storeName?: string;
    storeStatus?: 'auto' | 'open' | 'closed' | 'unlisted'; // add other relevant statuses as needed
    storeImage?: ImageInfo;
    products?: ProductItems[];
    storeId?: string;
    storeAddress?: Address;
  }

  interface ImageInfo {
    _id?: string;
    type?: string;
    ext?: string;
    classification?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    dimensions?: Dimensions;
    isPublic?: boolean;
    viewerIds?: string[];
    uploadId?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  interface Dimensions {
    height?: number;
    width?: number;
    ratio?: number;
    length?: number;
  }

  interface ProductItems {
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    images?: ImageInfo[];
    id?: string;
    _id?: string;
    options?: [];
  }

  interface ApiError {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type GetSearchResponse = Response | ApiError;

  interface Response {
    productCollections?: Products[];
  }

  interface Products {
    title?: string;
    icon?: string; // add other relevant statuses as needed
    query?: {
      tags?: string[];
    };
  }

  interface ApiError {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type GetBrowseGridResponse = Response | ApiError;

  interface Response {
    stores?: StoreItems[];
  }

  interface StoreItems {
    storeName?: string;
    storeStatus?: 'auto' | 'open' | 'closed' | 'unlisted'; // add other relevant statuses as needed
    storeImage?: ImageInfo;
    products?: ProductItems[];
  }

  interface ImageInfo {
    _id?: string;
    type?: string;
    ext?: string;
    classification?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    dimensions?: Dimensions;
    isPublic?: boolean;
    viewerIds?: string[];
    uploadId?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  interface Dimensions {
    height?: number;
    width?: number;
    ratio?: number;
    length?: number;
  }

  interface ProductItems {
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    images?: ImageInfo[];
    id?: string;
  }

  interface ApiError {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type GetSearchResponse = Response | ApiError;

  interface Geometry {
    longitude?: number;
    latitude?: number;
  }

  interface Address {
    street?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    geometry?: Geometry;
  }

  interface Hours {
    tz?: string;
    monday?: {
      opensAt?: number;
      closesAt?: number;
    };
    tuesday?: {
      opensAt?: number;
      closesAt?: number;
    };
    wednesday?: {
      opensAt?: number;
      closesAt?: number;
    };
    thursday?: {
      opensAt?: number;
      closesAt?: number;
    };
    friday?: {
      opensAt?: number;
      closesAt?: number;
    };
    saturday?: {
      opensAt?: number;
      closesAt?: number;
    };
    sunday?: {
      opensAt?: number;
      closesAt?: number;
    };
  }

  interface Image {
    type?: string;
    ext?: string;
    classification?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    dimensions?: {
      height?: number;
      width?: number;
      ratio?: number;
      length?: number;
    };
    isPublic?: boolean;
    createdAt?: string;
    updatedAt?: string;
    id?: string;
  }

  interface Vendor {
    name?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
    id?: string;
    image?: Image;
  }

  interface ShopDetails {
    status?: string;
    name?: string;
    address?: Address;
    hours?: Hours;
    cancelationPolicy?: string;
    availability?: boolean;
    rating?: number;
    delivery_timeframe?: string;
    createdAt?: string;
    updatedAt?: string;
    vendor?: Vendor;
    image?: Image;
    headerImage?: Image;
    id?: string;
  }

  interface SignUpRequestBody {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmationPassword?: string;
    isGuest?: boolean;
    signupType:string;
    authorizationCode:string

  }

  interface SignUpData {
    message?: string;
  }

  interface SignUpError {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type SignUpResponse = SignUpData | SignUpError;

  interface CartDetailsSectionProps {
    cartTotalPrice?: number;
    currentCartItem?: any[];
    productGetCartData?: any;
  }

  interface TextContentCardProps {
    title?: string;
    icon?: ReactNode;
    description?: string;
    buttonLabel?: ReactNode;
    buttonLabelStyle?: ViewStyle;
    buttonOnPress?: any;
    sectionContainer?: ViewStyle;
    descriptionStyle?: TextStyle;
    position?: 'flex-start' | 'flex-end' | 'center';
  }

  type imageItem = {
    id?: string;
    type?: string;
    ext?: string;
    classification?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    dimensions?: {
      height?: number;
      width?: number;
      ratio?: number;
      length?: number;
    };
    isPublic?: boolean;
    owner?: string;
    viewers?: string[];
    uploadId?: string;
  };

  type productItem = {
    id?: string;
    name?: string;
    images?: imageItem[];
    description?: string;
    price?: number;
  };

  type searchAllResponseBody = {
    id?: string;
    name?: string;
    image?: imageItem[];
    rate?: string;
    followers?: string;
    hour?: string;
    distance?: string;
    products?: productItem[];
  };

  interface GetAddressResponseBody {
    addresses?: Address[];
    help: any;
  }

  interface GetAddressErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type GetAddressResponse = GetAddressResponseBody | GetAddressErrorBody;

  interface Response {
    sections?: (ProductCollectionGrid | ItemGrid)[];
  }

  interface ProductCollectionGrid {
    type?: 'product-collection-grid';
    style?: 'icon';
    title?: string;
    columns?: number;
    items?: ProductGridItem[];
  }

  interface ItemGrid {
    type?: 'item-grid';
    style?: 'card';
    title?: string;
    columns?: number;
    items?: GridItem[];
  }

  interface ProductGridItem {
    title?: string;
    icon?: string;
    query?: {tags?: string[]};
  }

  interface GridItem {
    title?: string;
    icon?: string;
    link?: string;
  }

  interface ApiError {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type GetExploreResponse = Response | ApiError;

  interface PhoneVerifyRequestBody {
    phone?: string;
  }

  interface PhoneVerifyResponseBody {
    message?: string;
    uuid?: string;
  }

  interface PhoneVerifyErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type PhoneVerifyResponse = PhoneVerifyResponseBody | PhoneVerifyErrorBody;

  interface DeleteAddressResponseBody {
    message?: string;
  }

  interface DeleteAddressErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type DeleteAddressResponse =
    | DeleteAddressResponseBody
    | DeleteAddressErrorBody;

  interface GetOwnAccountResponseBody {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
  }

  interface DeleteAccountErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type GetOwnAccountResponse =
    | GetOwnAccountResponseBody
    | DeleteAccountErrorBody;

  interface ResetPasswordResponse {
    message?: string;
  }

  interface UpdateAddressResponseBody extends Address {}

  interface UpdateAddressErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type UpdateAddressResponse =
    | UpdateAddressResponseBody
    | UpdateAddressErrorBody;

  type ChangePasswordResponse = {
    message?: string;
  };

  type LoginWithEmailRequestBody = Pick<
    SignUpRequestBody,
    'email' & 'password'
  >;

  interface LoginWithEmailResponseBody {
    accessToken?: string;
    isGuest?: boolean;
    refreshToken: string;
  }

  interface LoginWithEmailErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type LoginWithEmailResponse =
    | LoginWithEmailResponseBody
    | LoginWithEmailErrorBody;

  interface LoginWithPhoneRequestBody {
    phone?: string;
  }

  interface LoginWithPhoneResponseBody {
    message?: string;
    uuid?: string;
  }

  interface LoginWithPhoneErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type LoginWithPhoneResponse =
    | LoginWithPhoneResponseBody
    | LoginWithPhoneErrorBody;

  interface ReverseGeocodingResponseBody {
    plus_code?: PlusCode;
    results?: ReverseGeocodingResult[];
    status?: string;
  }

  interface PlusCode {
    compound_code?: string;
    global_code?: string;
  }

  interface ReverseGeocodingResult {
    address_components?: AddressComponent[];
    formatted_address?: string;
    geometry?: Geometry;
    place_id?: string;
    plus_code?: PlusCode2;
    types?: string[];
  }

  interface AddressComponent {
    long_name?: string;
    short_name?: string;
    types?: string[];
  }

  interface Geometry {
    location?: Location;
    location_type?: string;
    viewport?: Viewport;
    bounds?: Bounds;
  }

  interface Location {
    lat?: number;
    lng?: number;
  }

  interface Viewport {
    northeast?: Northeast;
    southwest?: Southwest;
  }

  interface Northeast {
    lat?: number;
    lng?: number;
  }

  interface Southwest {
    lat?: number;
    lng?: number;
  }

  interface Bounds {
    northeast?: Northeast2;
    southwest?: Southwest2;
  }

  interface Northeast2 {
    lat?: number;
    lng?: number;
  }

  interface Southwest2 {
    lat?: number;
    lng?: number;
  }

  interface PlusCode2 {
    compound_code?: string;
    global_code?: string;
  }

  interface Dimensions {
    height?: number;
    width?: number;
    ratio?: number;
    length?: number;
  }

  interface ImageItem {
    id?: string;
    type?: string;
    ext?: string;
    classification?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    dimensions?: Dimensions;
    isPublic?: boolean;
    owner?: string;
    viewers?: string[];
    uploadId?: string;
  }

  interface Vendor {
    id?: string;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    imageId?: ImageItem;
  }

  interface Collection {
    id?: string;
    title?: string;
    subtitle?: string;
    imageId?: ImageItem;
    vendorId?: Vendor;
    productsCount?: number;
  }

  interface GetAllCollectionsResponseBody {
    collections?: Collection[];
  }

  interface GetAllCollectionsErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type GetAllCollectionsResponse =
    | GetAllCollectionsResponseBody
    | GetAllCollectionsErrorBody;

  interface LoginPhoneConfirmRequestBody {
    phone?: string;
    code?: string;
  }

  interface LoginPhoneConfirmResponseBody {
    accessToken?: string;
    user?: User;
  }

  interface LoginPhoneConfirmErrorBody {
    code?: string;
    status?: number;
    name?: string;
    message?: string;
  }

  type LoginPhoneConfirmResponse =
    | LoginPhoneConfirmResponseBody
    | LoginPhoneConfirmErrorBody;

  interface ISvgProps extends SvgProps {
    xmlns?: string;
    xmlnsXlink?: string;
    xmlSpace?: string;
    iconColor?: string;
  }

  interface DynamicThemeProps {
    scaleFactor?: number;
    mode?: 'light' | 'dark';
  }

  interface product {
    id?: number;
    product_name?: string;
    price?: number;
    unit?: string;
    image?: string;
  }

  interface shop {
    id?: number;
    shop_name?: string;
    rate?: number;
    followers?: string;
    hours?: string;
    distance?: string;
    image?: string;
    products?: product[];
  }

  interface tab {
    name?: string;
    value?: string;
    id?: string;
  }
}

export {};
