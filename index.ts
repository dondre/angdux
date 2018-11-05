import { BehaviorSubject } from 'rxjs';
import { Dictionary } from './interfaces';

const loadProps = (model: any) => {
    const _properties = new Dictionary<BehaviorSubject<any>>();
    Object.keys(model).forEach(key => 
        _properties.add(key, new BehaviorSubject(model[key]))
    );
    return _properties;
}

const loadActions = (actions: any) => {
    const _actions = new Dictionary<any>();
    Object.keys(actions).forEach(key => 
        _actions.add(key, actions[key])
    );
    return _actions;
}

const setState = (properties: Dictionary<BehaviorSubject<any>>)  => {
    return (state:any) => {
        if(!state) return;
        Object.keys(state).forEach(key => {
            const prop = properties.item(key);
            if(prop && prop.value !== state[key]) {
                prop.next(state[key]);
            }
        })
    }
}

const getState = (props: Dictionary<BehaviorSubject<any>>) => {
    let state:any = {};
    props.keys().forEach(key => {
        if(props.item(key))
            state[key] = props.item(key).value;
    })
    return state;
}

export interface IStore{
    properties: Dictionary<BehaviorSubject<any>>;
    actions: Dictionary<any>;
}

export const merge = (state:any, message:any) => {
    let merge:any = {};
    Object.keys(state).forEach(key => {
        merge[key] = state[key];
    });
    Object.keys(message).forEach(key => {
        if(key != "type")
            merge[key] = message[key];
    })
    return merge;
}

export const createStore =(initialState:any, actions:any) : IStore => {
    let properties = loadProps(initialState);
    actions = loadActions(actions);

   return {
        properties,
        actions
    };
}

export const dispatcher = (props:any, reducer:any) => {
    return (message:any) =>  {
        const currentState = getState(props);
        const state = reducer(currentState, message);
        setState(props)(state);
    }
}

export function Angdux(store:IStore) : ClassDecorator {

    return function ( constructor:any ) {
        const hooks = ['ngOnInit', 'ngOnChanges', 'ngOnDestroy'];
        hooks.forEach(hook => {
            const original = constructor.prototype[hook];
            switch(hook) {
                case "ngOnInit":
                constructor.prototype['ngOnInit'] = function (...args:any[]) {
                    let scope = this;
                    store.properties.keys().forEach(key  => {
                        store.properties.item(key)
                            .asObservable()
                            .subscribe((next:any) => {
                                scope[key] = next;
                            });
                    })
                    store.actions.keys().forEach(key => {
                        scope[key] = store.actions.item(key);
                    })
                    original && original.apply(scope, args);
                }
                break;
                case "ngOnChanges":
                constructor.prototype['ngOnChanges'] = function (...args:any[]) {
                    let scope = this;
                    original && original.apply(scope, args);
                }
                break;
                case "ngOnDestroy":
                constructor.prototype['ngOnDestroy'] = function (...args:any[]) {
                    let scope = this;
                    store.properties.values()
                        .forEach(p => p.next(null))
                    original && original.apply(scope, args);
                }
                break;
            }
        })
    }
}

