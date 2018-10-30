from flask import Flask, request
from flask import jsonify
from flask import render_template
from flask_cors import CORS


app = Flask(__name__)
CORS(app)



def replace_underlines(string):
    """
    Replaces underscores of a string with an empty character.
    :param string: String from which underscores will be removed.
    :return: underlines_replaced: String with underscores removed.
    """
    underlines_replaced = string.replace('_', '')
    return underlines_replaced

@app.route('/', defaults={'path': ''})
def hello_world(path):
    return render_template('index.html')

@app.route('/api')
def controller():
    """
    Controller that administrates the APIs requests.
    :return: json_response: JSON object with the output of the API.
    """
    string = request.args.get('utm_content')
    print(string)
    json_response = None
    if string is None:
        # Case in which string parameter is not supplied.
        json_response = dict(
            error='string URL parameter not found!'
        )
    else:
        # All is working well case.
            underlines_replaced = replace_underlines(string)
            json_response = dict(
                status_code=200,
                status="OK",
                string=underlines_replaced
            )

    return jsonify(json_response)


if __name__ == '__main__':
    app.run(debug=True,
            host='127.0.0.1',
            port=9000,
            threaded=True)
