
BIN=./node_modules/.bin

example:
	@ ${BIN}/sjs -m ./macros examples.sjs -r

raw:
	@ ${BIN}/sjs -m ./macros examples.sjs

pretty:
	@ ${BIN}/sjs -m ./macros examples.sjs -r | ${BIN}/uglifyjs -b

mangled:
	@ ${BIN}/sjs -m ./macros examples.sjs | ${BIN}/uglifyjs -b -m

test:
	@ ${BIN}/sjs -m ./macros test.sjs
