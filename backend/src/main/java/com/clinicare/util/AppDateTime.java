package com.clinicare.util;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

public final class AppDateTime {

    private static final String DEFAULT_TIME_ZONE = "America/Fortaleza";
    public static final ZoneId APP_ZONE = ZoneId.of(System.getenv().getOrDefault("APP_TIME_ZONE", DEFAULT_TIME_ZONE));

    private AppDateTime() {
    }

    public static ZonedDateTime now() {
        return truncateToMinutes(ZonedDateTime.now(APP_ZONE));
    }

    public static ZonedDateTime truncateToMinutes(ZonedDateTime dateTime) {
        return dateTime == null ? null : dateTime.truncatedTo(ChronoUnit.MINUTES);
    }
}
