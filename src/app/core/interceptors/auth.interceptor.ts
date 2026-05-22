import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    console.log("🔥 Interceptor running:", req.url);

    const userStr = localStorage.getItem('CurrentUser');

    if (userStr) {
        const user = JSON.parse(userStr);

        if (user?.token) {
            console.log("✅ Token attached");

            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        }
    }

    return next(req);
};
