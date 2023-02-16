// eslint-disable-next-line no-undef
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        "no-undef": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "import/no-commonjs": "off",
        "prefer-const": "off",
        "no-empty-function": "off"
    }
};