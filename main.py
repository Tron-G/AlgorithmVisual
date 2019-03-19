from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__, static_folder='static')


@app.route('/')
def home_page():
    return render_template('HomePage.html')


@app.route('/test')
def test_page():
    return render_template('test.html')


@app.route('/turn', methods=['POST', 'GET'])
def post_pie_data():
    return redirect(url_for('test'))


if __name__ == '__main__':
    app.run()
