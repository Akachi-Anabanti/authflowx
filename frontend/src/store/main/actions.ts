import { api } from '@/api';
import router from '@/router';
import { getCookieToken, getLocalToken, removeLocalToken, saveLocalToken } from '@/utils';
import { AxiosError } from 'axios';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import {
    commitAddNotification,
    commitRemoveNotification,
    commitSetLoggedIn,
    commitSetLogInError,
    commitSetRegisterError,
    commitSetToken,
    commitSetUserProfile,
} from './mutations';
import { AppNotification, MainState } from './state';
import { IUserProfileCreate } from '@/interfaces';

type MainContext = ActionContext<MainState, State>;

export const actions = {
    async  actionRegister(context: MainContext, payload: IUserProfileCreate) {
        try {
            const response = await api.createUser(payload);

            if (response.status === 201) {
                commitAddNotification(context, { content: 'User successfully created', color: 'success' });
            }
            await dispatchLogIn(context);

        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },

    async actionLogIn(context: MainContext) {
        const token = getCookieToken();
        if (token) {
            saveLocalToken(token);
            commitSetToken(context, token);
            commitSetLoggedIn(context, true);
            commitSetLogInError(context, false);
            await dispatchGetUserProfile(context);
            await dispatchRouteLoggedIn(context);
            commitAddNotification(context, { content: 'Logged in', color: 'success' });
        } else {
            await dispatchLogOut(context);
        }
    },

    async actionGetUserProfile(context: MainContext) {
        try {
            const response = await api.getMe(context.state.token);

            if (response.data) {
                commitSetUserProfile(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },

    async actionUpdateUserProfile(context: MainContext, payload) {
        try {
            const loadingNotification = { content: 'saving', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.updateMe(context.state.token, payload),
                await new Promise<void>((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitSetUserProfile(context, response.data);
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Profile successfully updated', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },

    async actionCheckLoggedIn(context: MainContext) {
        if (!context.state.isLoggedIn) {
            let token = context.state.token;
            if (!token) {
                const localToken = getLocalToken();
                if (localToken) {
                    commitSetToken(context, localToken);
                    token = localToken;
                }
            }
            if (token) {
                try {
                    const response = await api.getMe(token);
                    commitSetLoggedIn(context, true);
                    commitSetUserProfile(context, response.data);
                } catch (error) {
                    await dispatchRemoveLogIn(context);
                }
            } else {
                await dispatchRemoveLogIn(context);
            }
        }
    },

    async actionRemoveLogIn(context: MainContext) {
        removeLocalToken();
        commitSetToken(context, '');
        commitSetLoggedIn(context, false);
    },

    async actionLogOut(context: MainContext) {
        await dispatchRemoveLogIn(context);
        await dispatchRouteLogOut(context);
    },

    async actionUserLogOut(context: MainContext) {
        await dispatchLogOut(context);
        commitAddNotification(context, { content: 'Logged out', color: 'success' });
    },

    actionRouteLogOut(context: MainContext) {
        if (router.currentRoute.path !== '/login') {
            router.push('/login');
        }
    },

    async actionCheckApiError(context: MainContext, payload: AxiosError) {
        if (payload.response!.status === 401) {
            await dispatchLogOut(context);
        }
    },
    actionRouteLoggedIn(context: MainContext) {
        if (router.currentRoute.path === '/login' || router.currentRoute.path === '/') {
            router.push('/main');
        }
    },
    async removeNotification(context: MainContext, payload: { notification: AppNotification, timeout: number }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commitRemoveNotification(context, payload.notification);
                resolve(true);
            }, payload.timeout);
        });
    },
};

const { dispatch } = getStoreAccessors<MainState | any, State>('');

export const dispatchCheckApiError = dispatch(actions.actionCheckApiError);
export const dispatchCheckLoggedIn = dispatch(actions.actionCheckLoggedIn);
export const dispatchGetUserProfile = dispatch(actions.actionGetUserProfile);
export const dispatchLogIn = dispatch(actions.actionLogIn);
export const dispatchRemoveLogIn = dispatch(actions.actionRemoveLogIn);
export const dispatchUpdateUserProfile = dispatch(actions.actionUpdateUserProfile);
export const dispatchRemoveNotification = dispatch(actions.removeNotification);
export const dispatchLogOut = dispatch(actions.actionLogOut);
export const dispatchUserLogOut = dispatch(actions.actionUserLogOut);
export const dispatchRouteLoggedIn = dispatch(actions.actionRouteLoggedIn);
export const dispatchRouteLogOut = dispatch(actions.actionRouteLogOut);
export const dispatchRegister = dispatch(actions.actionRegister);
