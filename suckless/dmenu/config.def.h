static int topbar = 1;

static const char *fonts[] = {
	"Iosevka:size=10"
};

static const char *prompt = "Run: ";

static const char *colors[SchemeLast][2] = {
	/*     fg         bg       */
	[SchemeNorm] = { "#bbbbbb", "#222222" },
	[SchemeSel] = { "#eeeeee", "#005577" },
	[SchemeOut] = { "#000000", "#00ffff" },
};

static unsigned int lines = 7; // lineas 

static const char worddelimiters[] = " ";
