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

[
	"{"
	"}"
	"("
	")"
	"["
	"]"
] @puncuation.bracket

(type_cast
	"<" @puncuation.bracket
	(type_signature)
	">" @puncuation.bracket)

(identifier) @variable

(comment) @comment
(documentation_comment) @comment.doc

(const_declaration
	(identifier) @constant)

(shebang) @comment

(boolean_literal) @boolean
(number_literal) @number
[
	(char_literal)
	(string_literal)
] @string

(escaped_character) @string.escape

(method
	(identifier) @function)
(reference
	(identifier) @function
	(func_call))
(reference
	(identifier) @variable
	(accessor)
	(func_call))
(constructor
	(identifier) @type)

(operator) @operator

(let_declaration (identifier) @variable)
(const_declaration (identifier) @constant)

(property
	(identifier) @property)

(structs
	(identifier) @type)
(classes
	(identifier) @type)

(type_signature) @type
(type_signature (identifier) @type) @type


