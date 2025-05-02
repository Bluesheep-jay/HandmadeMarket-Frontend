import { createStore } from 'vuex';
import users from './modules/users';
import shops from './modules/shops';
import categories from './modules/categories';
import products from './modules/products';
import orders from './modules/orders';
import vouchers from './modules/vouchers';
import transactions from './modules/transactions';
import commission from './modules/commission';
import statistics from './modules/statistics';

export default createStore({
  modules: {
    users,
    shops,
    categories,
    products,
    orders,
    vouchers,
    transactions,
    commission,
    statistics
  }
});