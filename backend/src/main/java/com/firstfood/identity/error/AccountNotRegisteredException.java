package com.firstfood.identity.error;

import com.firstfood.common.error.DomainException;
import com.firstfood.identity.Portal;
import java.util.Locale;
import org.springframework.http.HttpStatus;

/** Sign-in on a portal where this number has no registration. Raised BEFORE the OTP is consumed. */
public class AccountNotRegisteredException extends DomainException {

    public AccountNotRegisteredException(Portal portal) {
        super("ACCOUNT_NOT_REGISTERED",
                "No " + portal.name().toLowerCase(Locale.ROOT) + " account exists for this number. Create one to continue.",
                HttpStatus.NOT_FOUND);
    }

    /** The portal-less login (F-12): the number has no account on either portal. */
    public AccountNotRegisteredException() {
        super("ACCOUNT_NOT_REGISTERED",
                "No account exists for this number. Create one on the customer or staff portal to continue.",
                HttpStatus.NOT_FOUND);
    }
}
