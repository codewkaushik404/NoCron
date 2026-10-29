import { Router } from "express";
import passport from "passport";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const router = Router();

router.get("/google", passport.authenticate("google", 
    {
        scope: ["profile", "email"]
    }
))

router.get("/google/callback", 
    passport.authenticate("google", {
        session: true
    }),
    (req, res) => {
        return res.json(new ApiResponse(200, "User authenticated successfully", null));
    }
)

router.get("/me", (req, res) => {
    if(!req.isAuthenticated()) throw new ApiError(401, "User not authenticated", null);

    return res.json(new ApiResponse(200, "User details fetched successfully", req.user ?? null));
})

router.delete("/logout", (req, res, next) => {

    if(!req.isAuthenticated()) throw new ApiError(401, "User not authenticated", null);
    
    req.logout((logoutError) => {
        if(logoutError) return next(logoutError);

        req.session.destroy((sessionError) => {
            if(sessionError) return next(sessionError);

            res.clearCookie('sid');
            return res.json(new ApiResponse(200, "User logged-out sucessfully", null));
        })
    })
})

export default router;