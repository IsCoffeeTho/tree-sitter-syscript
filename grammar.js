/**
 * @file Syscript grammar for tree-sitter
 * @author Aaron Menadue
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
	name: "syscript",

	extras: $ => [/\s/, $.comment],

	conflicts: $ => [
		[$.code_block, $.struct_literal]
	],

	rules: {
		source_file: $ => seq(optional($.shebang), repeat(choice($.function, $.declaration, $.structs, $.classes, $.typedef))),

		shebang: $ => seq("#!", /.*/),

		comment: $ => choice($.single_line_comment, $.documentation_comment, $.multi_line_comment),
		single_line_comment: $ => token(seq("//", /.*/)),
		documentation_comment: $ => token(seq("/**", /([^/]|(\/\*))*\*/, "/")),
		multi_line_comment: $ => token(seq("/*", /([^/]|(\/\*))*\*/, "/")),

		classes: $ =>
			seq("class", field("name", $.identifier), optional(seq("extends", $.identifier)), "{", field("fields", repeat(choice($.field, $.method))), "}"),
		structs: $ => seq("struct", field("name", $.identifier), optional(seq("extends", $.identifier)), "{", field("fields", repeat($.field)), "}"),

		field: $ => seq($.identifier, ":", $.type_signature, ";"),
		property: $ => seq($.identifier, ":", $.value),
		property_list: $ => seq($.property, repeat(seq(",", $.property))),

		typedef: $ => seq("typedef", $.identifier, "=", $.type_signature, ";"),

		function: $ => seq("fn", $.method),
		method: $ => seq(field("name", $.identifier), $.param_list, optional(seq(":", choice($.type_signature, "noreturn"))), $.code_block),
		param_list: $ => seq("(", optional(seq($.parameter, optional(seq(",", $.parameter)))), ")"),
		parameter: $ => seq(optional("..."), $.identifier, ":", $.type_signature),
		code_block: $ => seq("{", repeat($.statement), "}"),

		declaration: $ => seq(choice($.let_declaration, $.const_declaration), ";"),
		let_declaration: $ => seq("let", field("name", $.identifier), ":", field("type", $.type_signature), optional(seq("=", field("value", $.value)))),
		const_declaration: $ => seq("const", field("name", $.identifier), ":", field("type", $.type_signature), "=", field("value", $.value)),

		statement: $ => choice($.if_statement, $.while_loop, $.for_loop, $.declaration, seq(choice($.return_statement, $.control_flow, $.value), ";")),

		return_statement: $ => seq("return", optional($.value)),
		control_flow: $ => choice("break", "continue"),

		routine: $ => choice($.code_block, $.statement),
		if_statement: $ => prec.right(1, seq("if", field("condition", $.parenthesis_enclosed), $.routine, optional(seq("else", $.routine)))),
		while_loop: $ => seq("while", field("condition", $.parenthesis_enclosed), $.routine),

		for_loop: $ => seq("for", $.for_loop_def, $.routine),
		for_loop_def: $ =>
			seq(
				"(",
				field("declaration", optional($.let_declaration)),
				";",
				field("condition", optional($.value)),
				";",
				field("mutation", optional($.value)),
				")",
			),

		value: $ => prec.left(1, seq($.singleton, repeat(seq($.operator, $.singleton)))),
		value_list: $ => seq($.value, repeat(seq(",", $.value))),
		parenthesis_enclosed: $ => seq("(", $.value, ")"),

		singleton: $ =>
			prec.left(
				1,
				seq(
					optional($.type_cast),
					optional(choice("++", "--", "new", repeat1(choice("!", "-", "~")))),
					choice($.ref_parenthesis_enclosed, $.ref_primitive, $.reference),
					optional(choice("++", "--")),
				),
			),

		reference: $ => prec.left(1, seq($.identifier, repeat(choice($.accessor, $.func_call)), optional($.sub_reference))),
		ref_parenthesis_enclosed: $ => prec.left(1, seq($.parenthesis_enclosed, repeat(choice($.accessor, $.func_call)), optional($.sub_reference))),
		ref_primitive: $ => prec.left(1, seq($.primitive, repeat(choice($.accessor, $.func_call)), optional($.sub_reference))),

		accessor: $ => seq("[", $.value, "]"),
		func_call: $ => seq("(", optional($.value_list), ")"),

		sub_reference: $ => seq(".", $.reference),

		primitive: $ => choice($.struct_literal, $.array_literal, $.boolean_literal, $.char_literal, $.number_literal, $.string_literal, $.builtin_literal),
		builtin_literal: $ => choice("this", "super", "null"),
		array_literal: $ => seq("[", optional($.value_list), "]"),
		struct_literal: $ => seq("{", optional($.property_list), "}"),
		boolean_literal: $ => choice("true", "false"),
		number_literal: $ => choice($.numeric, $.decimal_number, $.hex_number, $.binary_number),

		string_literal: $ => seq('"', repeat(choice(/[^"\\\r\n]+/, $.escaped_character)), '"'),

		char_literal: $ => seq("'", repeat(choice(/[^'\\\r\n]+/, $.escaped_character)), "'"),

		escaped_character: $ => token(seq("\\", choice(/\r?\n/, /[^xuU0-7]/, /[0-7]{1,3}/, /x[0-9a-fA-F]{2}/, /u[0-9a-fA-F]{4}/, /U[0-9a-fA-F]{8}/))),

		decimal_number: $ => prec.left(1, seq($.numeric, ".", $.numeric)),
		hex_number: $ => /0x[0-9a-fA-F]*/,
		binary_number: $ => /0b[01]*/,

		type_signature: $ => choice(seq($.identifier, optional("[]")), "void"),
		type_cast: $ => seq("<", $.type_signature, ">"),

		operator: $ => choice($.logical_op, $.comparative_op, $.arithmetic_op, $.assignment_op),

		logical_op: $ => choice("||", "&&"),
		comparative_op: $ => choice("==", "!=", ">=", "<=", ">", "<"),
		arithmetic_op: $ => choice("+", "-", "*", "/", "%", "&", "|", "^", "<<", ">>"),
		assignment_op: $ => choice("=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^="),

		identifier: $ => /([a-zA-Z_][0-9a-zA-Z_]*)/,
		numeric: $ => /([0-9][0-9_]*)/,
	},
});
