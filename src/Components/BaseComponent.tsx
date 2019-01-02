    import * as React from 'react';

    export abstract class BaseComponent<TProps, TState> extends React.Component<TProps, TState> {

        //private _subscribedStores: { store: Flux.IStore; onChange: () => void}[];

        private _storeSubscriptionsClosed: boolean;

        constructor(props: TProps) {
            super(props);
            //this._subscribedStores = [];
            this._storeSubscriptionsClosed = false;
        }

        public componentWillMount(): void {
            this._storeSubscriptionsClosed = true;
            //this.subscribeToAllStores();
        }

        public componentWillUnmount(): void {
            //this.cancelAllStoresSubscriptions();
        }
/*
        protected isAnyStoreLoading() {
            if (!Utils.Arrays.isNullOrEmpty(this._subscribedStores)) {
                for (var i = 0; i < this._subscribedStores.length; i++) {
                    if (this._subscribedStores[i].store.isLoading()) {
                        return true;
                    }
                }
            }

            return false;
        }

        protected subscribeToStore(store: Flux.IStore, onChange: () => void) : void {
            Utils.Assert(!this._storeSubscriptionsClosed, "Attempted to subscribe to a store after component is initialized. subscribeToStore can be called only in a constructor");
            this._subscribedStores.push({ store: store, onChange: onChange });
        }

        private subscribeToAllStores(): any {
            if (!Utils.Arrays.isNullOrEmpty(this._subscribedStores)) {
                for (var i = 0; i < this._subscribedStores.length; i++) {
                    this._subscribedStores[i].store.onChange(this, this._subscribedStores[i].onChange);
                }
            }
        }

        private cancelAllStoresSubscriptions(): any {
            if (!Utils.Arrays.isNullOrEmpty(this._subscribedStores)) {
                for (var i = 0; i < this._subscribedStores.length; i++) {
                    this._subscribedStores[i].store.removeChangeListener(this);
                }
            }
        }*/
    }
