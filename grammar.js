/**
 * @file Syscript grammar for tree-sitter
 * @author Aaron Menadue
 * @license MIT
 */

/// <reference types="tree-`sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
	name: "syscript",

	extras: $ => [/\s/, $._comments],

	rules: {
		source_file: $ => seq(optional($.shebang), repeat(choice($.function, $.declaration))),

		shebang: $ => seq("#!", /.*/),

		_comments: $ => choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "*/")),

		function: $ => seq("fn", $.identifier, $.param_list, optional(seq(":", $.type_signature)), $.code_block),
		param_list: $ => seq("(", optional(seq($.parameter, optional(seq(",", $.parameter)))), ")"),
		parameter: $ => seq($.identifier, ":", $.type_signature),
		code_block: $ => seq("{", repeat($.statement), "}"),

		statement: $ => choice($.if_statement, $.while_loop, $.for_loop, $.declaration, seq(choice($.return_statement, $.control_flow, $.value), ";")),

		return_statement: $ => seq("return", optional($.value)),
		control_flow: $ => choice("break", "continue"),

		_routine: $ => choice($.code_block, $.statement),
		if_statement: $ => prec.right(1, seq("if", $.parenthesis_enclosed, $._routine, optional(seq("else", $._routine)))),
		while_loop: $ => seq("while", $.parenthesis_enclosed, $._routine),

		for_loop: $ => seq("for", $._for_loop_parenthesis, $._routine),
		_for_loop_parenthesis: $ => seq("(", optional($.let_declaration), ";", optional($.value), ";", optional($.value), ")"),

		declaration: $ => seq(choice($.let_declaration, $.const_declaration), ";"),
		let_declaration: $ => seq("let", field("name", $.identifier), ":", field("type", $.type_signature), optional(seq("=", field("value", $.value)))),
		const_declaration: $ => seq("const", field("name", $.identifier), ":", field("type", $.type_signature), "=", field("value", $.value)),

		value: $ => prec.left(1, seq($.singleton, repeat(seq($.operator, $.singleton)))),
		value_list: $ => seq($.value, repeat(seq(",", $.value))),

		singleton: $ =>
			prec.left(
				1,
				seq(
					optional($.type_cast),
					optional(choice(repeat1(choice("!", "-", "~")), "++", "--")),
					choice($.parenthesis_enclosed, $.primitive, $.identifier),
					repeat(choice($.accessor, $.func_call, $.sub_reference)),
					optional(choice("++", "--")),
				),
			),

		parenthesis_enclosed: $ => seq("(", $.value, ")"),
		accessor: $ => seq("[", $.value, "]"),
		func_call: $ => seq("(", optional($.value_list), ")"),
		sub_reference: $ => seq(".", $.identifier),

		primitive: $ => choice($.array_literal, $.boolean_literal, $.char_literal, $.number_literal, $.string_literal),
		array_literal: $ => seq("[", optional($.value_list), "]"),
		boolean_literal: $ => choice("true", "false"),
		char_literal: $ => seq("'", token(/[^']*(\\[^']*)*/), "'"),
		string_literal: $ => seq('"', token(/[^"]*(\\[^"]*)*/), '"'),
		number_literal: $ => choice($.decimal_number, $.hex_number, $.binary_number),

		decimal_number: $ => prec.left(1, seq($.numeric, optional(seq(".", $.numeric)))),
		hex_number: $ => /0x[0-9a-fA-F]*/,
		binary_number: $ => /0b[01]*/,

		type_signature: $ => seq($.identifier, repeat("[]")),
		type_cast: $ => seq("<", $.type_signature, ">"),

		operator: $ => choice($.logical_op, $.comparative_op, $.arithmetic_op, $.assignment_op),

		logical_op: $ => choice("||", "&&"),
		comparative_op: $ => choice("==", "!=", ">=", "<=", ">", "<"),
		arithmetic_op: $ => choice("+", "-", "*", "/", "%", "&", "|", "^"),
		assignment_op: $ => choice("=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^="),

		identifier: $ => /([a-zA-Z_][0-9a-zA-Z_]*)/,
		numeric: $ => /([0-9][0-9_]*)/,
	},
});
