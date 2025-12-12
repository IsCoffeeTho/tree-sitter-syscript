import XCTest
import SwiftTreeSitter
import TreeSitterSyscript

final class TreeSitterSyscriptTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_syscript())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Syscript grammar")
    }
}
