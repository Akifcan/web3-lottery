export const ethereumWrapper = (fn) => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        fn()
    } else {
        alert('install metamask')
    }
}
