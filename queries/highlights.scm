[
	"if"
	"else"
	"while"
	"for"
	"continue"
	"break"
	"let"
	"const"
	"fn"
	"return"
	"class"
	"struct"
	"typedef"
	"extends"
	"new"
] @keyword

[
	"void"
	"noreturn"
	"null"
	"this"
	"super"
] @constant.builtin

(identifier) @property

(comment) @comment

(const_declaration
	(identifier) @constant)

(shebang) @comment

(boolean_literal) @boolean
(char_literal) @string
(string_literal) @string
(number_literal) @number

(method
	(identifier) @function)

(reference
	(identifier) @function
	(func_call))

(reference
	(identifier) @property
	(accessor)
	(func_call))

(let_declaration (identifier) @variable)
(const_declaration (identifier) @variable.constant)

(type_signature) @type
(type_signature (identifier) @type) @type


