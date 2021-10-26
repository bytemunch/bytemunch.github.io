for f in ./src/posts/*/
do
    echo "Converting $f"
    # f2=${f%*/}
    # f2=${f2##*/}
    showdown makehtml -i $f/main.md -o $f/index.html
done