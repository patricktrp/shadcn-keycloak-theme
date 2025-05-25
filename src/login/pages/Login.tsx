import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SOCIAL_PROVIDER_ICONS = {
    apple: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
            />
        </svg>
    ),
    google: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
            />
        </svg>
    ),
    facebook: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-facebook-icon lucide-facebook"
        >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    ),
    instagram: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-instagram-icon lucide-instagram"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    ),
    twitter: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-instagram-icon lucide-instagram"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    ),
    linkedin: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-linkedin-icon lucide-linkedin"
        >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    ),
    github: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-github-icon lucide-github"
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    )
};

const SocialProviders = ({ providers }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {providers.map((...[p, , providers]) => (
                <Button key={p.providerId} variant="outline" className="w-full">
                    {SOCIAL_PROVIDER_ICONS[p.providerId]}
                    {kcSanitize(p.displayName)}
                </Button>

                // <li key={p.alias}>
                //     <a id={`social-${p.alias}`} type="button" href={p.loginUrl}>
                //         {p.iconClasses && <i className={clsx(p.iconClasses)} aria-hidden="true"></i>}
                //         <span
                //             className={clsx(p.iconClasses && "kc-social-icon-text")}
                //             dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                //         ></span>
                //     </a>
                // </li>
            ))}
        </div>
    );
};

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const socialProvidersNode = (
        <div>
            {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                <div id="kc-social-providers">
                    <h2>{msg("identity-provider-login-label")}</h2>
                    <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                        {social.providers.map((...[p, , providers]) => (
                            <li key={p.alias}>
                                <a
                                    id={`social-${p.alias}`}
                                    className={kcClsx("kcFormSocialAccountListButtonClass", providers.length > 3 && "kcFormSocialAccountGridItem")}
                                    type="button"
                                    href={p.loginUrl}
                                >
                                    {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                    <span
                                        className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                        dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                    ></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6")} {...props}>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <a href="#" className="flex flex-col items-center gap-2 font-medium">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                        <GalleryVerticalEnd className="size-6" />
                                    </div>
                                    <span className="sr-only">Clout Copilot</span>
                                </a>
                                <h1 className="text-xl font-bold">Welcome to Clout Copilot</h1>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <a href="#" className="underline underline-offset-4">
                                        Sign up
                                    </a>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                                            {/* Forgot your password? */}
                                            {msg("doForgotPassword")}
                                        </a>
                                    </div>
                                    <Input id="password" type="password" required tabIndex={3} name="password" />
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoginButtonDisabled} name="login" id="kc-login">
                                    {msgStr("doLogIn")}
                                </Button>
                            </div>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">Or</span>
                            </div>
                            {social?.providers && <SocialProviders providers={social?.providers} />}
                        </div>
                    </form>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>

        // <Template
        //     kcContext={kcContext}
        //     i18n={i18n}
        //     doUseDefaultCss={doUseDefaultCss}
        //     classes={classes}
        //     displayMessage={!messagesPerField.existsError("username", "password")}
        //     headerNode={msg("loginAccountTitle")}
        //     displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
        //     infoNode={
        //         <div id="kc-registration-container">
        //             <div id="kc-registration">
        //                 <span>
        //                     {msg("noAccount")}{" "}
        //                     <a tabIndex={8} href={url.registrationUrl}>
        //                         {msg("doRegister")}
        //                     </a>
        //                 </span>
        //             </div>
        //         </div>
        //     }
        //     socialProvidersNode={
        //         <>
        //             {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
        //                 <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
        //                     <hr />
        //                     <h2>{msg("identity-provider-login-label")}</h2>
        //                     <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
        //                         {social.providers.map((...[p, , providers]) => (
        //                             <li key={p.alias}>
        //                                 <a
        //                                     id={`social-${p.alias}`}
        //                                     className={kcClsx(
        //                                         "kcFormSocialAccountListButtonClass",
        //                                         providers.length > 3 && "kcFormSocialAccountGridItem"
        //                                     )}
        //                                     type="button"
        //                                     href={p.loginUrl}
        //                                 >
        //                                     {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
        //                                     <span
        //                                         className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
        //                                         dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
        //                                     ></span>
        //                                 </a>
        //                             </li>
        //                         ))}
        //                     </ul>
        //                 </div>
        //             )}
        //         </>
        //     }
        // >
        //     <div id="kc-form">
        //         <div id="kc-form-wrapper">
        //             {realm.password && (
        //                 <form
        //                     id="kc-form-login"
        //                     onSubmit={() => {
        //                         setIsLoginButtonDisabled(true);
        //                         return true;
        //                     }}
        //                     action={url.loginAction}
        //                     method="post"
        //                 >
        //                     {!usernameHidden && (
        //                         <div className={kcClsx("kcFormGroupClass")}>
        //                             <label htmlFor="username" className={kcClsx("kcLabelClass")}>
        //                                 {!realm.loginWithEmailAllowed
        //                                     ? msg("username")
        //                                     : !realm.registrationEmailAsUsername
        //                                       ? msg("usernameOrEmail")
        //                                       : msg("email")}
        //                             </label>
        //                             <input
        //                                 tabIndex={2}
        //                                 id="username"
        //                                 className={kcClsx("kcInputClass")}
        //                                 name="username"
        //                                 defaultValue={login.username ?? ""}
        //                                 type="text"
        //                                 autoFocus
        //                                 autoComplete="username"
        //                                 aria-invalid={messagesPerField.existsError("username", "password")}
        //                             />
        //                             {messagesPerField.existsError("username", "password") && (
        //                                 <span
        //                                     id="input-error"
        //                                     className={kcClsx("kcInputErrorMessageClass")}
        //                                     aria-live="polite"
        //                                     dangerouslySetInnerHTML={{
        //                                         __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
        //                                     }}
        //                                 />
        //                             )}
        //                         </div>
        //                     )}

        //                     <div className={kcClsx("kcFormGroupClass")}>
        //                         <label htmlFor="password" className={kcClsx("kcLabelClass")}>
        //                             {msg("password")}
        //                         </label>
        //                         <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
        //                             <input
        //                                 tabIndex={3}
        //                                 id="password"
        //                                 className={kcClsx("kcInputClass")}
        //                                 name="password"
        //                                 type="password"
        //                                 autoComplete="current-password"
        //                                 aria-invalid={messagesPerField.existsError("username", "password")}
        //                             />
        //                         </PasswordWrapper>
        //                         {usernameHidden && messagesPerField.existsError("username", "password") && (
        //                             <span
        //                                 id="input-error"
        //                                 className={kcClsx("kcInputErrorMessageClass")}
        //                                 aria-live="polite"
        //                                 dangerouslySetInnerHTML={{
        //                                     __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
        //                                 }}
        //                             />
        //                         )}
        //                     </div>

        //                     <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
        //                         <div id="kc-form-options">
        //                             {realm.rememberMe && !usernameHidden && (
        //                                 <div className="checkbox">
        //                                     <label>
        //                                         <input
        //                                             tabIndex={5}
        //                                             id="rememberMe"
        //                                             name="rememberMe"
        //                                             type="checkbox"
        //                                             defaultChecked={!!login.rememberMe}
        //                                         />{" "}
        //                                         {msg("rememberMe")}
        //                                     </label>
        //                                 </div>
        //                             )}
        //                         </div>
        //                         <div className={kcClsx("kcFormOptionsWrapperClass")}>
        //                             {realm.resetPasswordAllowed && (
        //                                 <span>
        //                                     <a tabIndex={6} href={url.loginResetCredentialsUrl}>
        //                                         {msg("doForgotPassword")}
        //                                     </a>
        //                                 </span>
        //                             )}
        //                         </div>
        //                     </div>

        //                     <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
        //                         <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
        //                         <input
        //                             tabIndex={7}
        //                             disabled={isLoginButtonDisabled}
        //                             className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
        //                             name="login"
        //                             id="kc-login"
        //                             type="submit"
        //                             value={msgStr("doLogIn")}
        //                         />
        //                     </div>
        //                 </form>
        //             )}
        //         </div>
        //     </div>
        // </Template>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { kcClsx, i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <div className={kcClsx("kcInputGroup")}>
            {children}
            <button
                type="button"
                className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                <i className={kcClsx(isPasswordRevealed ? "kcFormPasswordVisibilityIconHide" : "kcFormPasswordVisibilityIconShow")} aria-hidden />
            </button>
        </div>
    );
}
