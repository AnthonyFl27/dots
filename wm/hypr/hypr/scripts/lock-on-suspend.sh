#!/usr/bin/env bash
# Launch hyprlock right before the system suspends, so the screen is
# already locked when the laptop resumes (e.g. after closing/reopening
# the lid). Listens to logind's PrepareForSleep signal on the system bus.
set -u

/usr/bin/gdbus monitor --system \
    --dest org.freedesktop.login1 \
    --object-path /org/freedesktop/login1 2>/dev/null |
while IFS= read -r line; do
    # PrepareForSleep with arg "true" = system is about to sleep -> lock now
    case "$line" in
        *PrepareForSleep*true*)
            pgrep -x hyprlock >/dev/null 2>&1 || /usr/bin/hyprlock &
            ;;
    esac
done
