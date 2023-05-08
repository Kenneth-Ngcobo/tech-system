export default async function({$auth, redirect, store, route}) {
    if(!$auth.loggedIn) {
        //console.log('store.user = ', store.user)
        console.log('auth-guard $route = ', route)
        redirect(`/login?redirect=${route.path}`)
    }
    /*else {
        redirect(`/${route.path}`)
    }*/
   
}