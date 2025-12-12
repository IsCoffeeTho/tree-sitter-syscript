/**
 * @file Syscript grammar for tree-sitter
 * @author Aaron Menadue
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
	name: "syscript",

	extras: $ => [/\s/, $._comments],

	rules: {
		source_file: $ => seq(optional($._shebang), repeat($._doc_level)),
		_shebang: $ => seq("#!", /.*\n/),
		_doc_level: $ => choice($._func_def, $._declaration),
		_func_def: $ =>
			seq(
				"fn",
				$._identifier,
				"(",
				optional(seq($._identifier, ":", $._type_sig, optional(repeat(seq(",", $._identifier, ":", $._type_sig))))),
				")",
				optional(seq(":", $._type_sig)),
				$._codeblock,
			),

		_codeblock: $ => seq("{", optional(repeat($._statement)), "}"),
		_statement: $ => choice($._if_statement, $._for_loop, $._while_loop),
		_if_statement: $ =>
			prec.left(1, seq("if", $._parenth_enclosed, choice($._codeblock, $._statement), optional(seq("else", choice($._codeblock, $._statement))))),
		_while_loop: $ => seq("while", $._parenth_enclosed, choice($._codeblock, $._statement)),
		_for_loop: $ => seq("for", "(", choice($._declaration, ";"), optional($._value), ";", optional($._value), ")", choice($._codeblock, $._statement)),

		_struct: $ => seq("struct", $._identifier, "{", optional(repeat(seq($._identifier, ":", $._type_sig, ";"))), "}"),

		_declaration: $ => seq(choice("const", "let"), $._identifier, ":", $._type_sig, optional(seq("=", $._value)), ";"),

		_singleton_value: $ =>
			seq(
				optional(repeat(choice("!", "~", "-", "++", "--"))),
				choice($._parenth_enclosed, $._primitive, $._identifier),
				optional(repeat(choice($._accessor, $._func_call, $._sub_reference))),
				optional(repeat(choice("++", "--"))),
			),
		_accessor: $ => seq("[", $._value, "]"),
		_func_call: $ => seq("(", optional(seq($._value, optional(seq(",", $._value)))), ")"),
		_sub_reference: $ => seq(".", $._identifier),
		_value: $ => seq($._singleton_value, optional(repeat(seq($._operator, $._singleton_value)))),
		_parenth_enclosed: $ => seq("(", $._value, ")"),

		_type_sig: $ => seq($._identifier, optional("[]")),

		_operator: $ => choice($._logical_operator, $._comparative_operator, $._arithmetic_operator, $._assignment_operator),
		_logical_operator: $ => choice("||", "&&"),
		_comparative_operator: $ => choice("<", ">", "==", "!=", ">=", "<="),
		_arithmetic_operator: $ => choice("+", "-", "*", "/", "%", "&", "|", "^", "<<", ">>"),
		_assignment_operator: $ => choice("=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>="),

		_primitive: $ => choice($._number_literal, $._char_literal, $._string_literal, $._bool_literal, $._array_literal),
		_number_literal: $ =>
			choice(
				seq("0x", optional(repeat(/[0-9a-fA-F]/))),
				seq("0b", optional(repeat(choice("0", "1")))),
				prec.left(1, seq($._numeric, optional(seq(".", $._numeric)))),
			),
		_char_literal: $ => seq("'", /[^']*/, optional(repeat(seq("\\'", /[^']*/))), "'"),
		_string_literal: $ =>
			choice(seq('"', /[^"]*/, optional(repeat(seq('\\"', /[^"]*/))), '"'), seq("`", /[^`]*/, optional(repeat(seq("\\`", /[^`]*/))), "`")),
		_bool_literal: $ => choice("true", "false"),
		_array_literal: $ => seq("[", optional(seq($._value, optional(seq(",", $._value)))), "]"),

		_comments: $ => token(choice(seq("//", /.*/), seq("/*", /.*/, "*/"))),

		_identifier: $ => /([a-zA-Z_][0-9a-zA-Z_]*)/,
		_numeric: $ => /([0-9][0-9_]*)/,
	},
});
