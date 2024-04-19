from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://mvpfantasy:balls@34.31.136.100/mvpesg'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/data')
def get_data():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

@app.route('/aboveAverageESGcompanies', methods=['GET'])
def get_companies():
    with app.app_context():
        with db.engine.connect() as conn:
            result = conn.execute(text('''
                                        SELECT c.name, es.total
                                        FROM Company c JOIN ESG_Score es ON c.ticker = es.ticker
                                        WHERE es.total > (
                                            SELECT AVG(total) FROM ESG_Score
                                        )
                                        ORDER BY es.total DESC, c.name;
                                       '''))
            companies = [row[0] for row in result]
            print(companies)
            return jsonify({'message': companies})

if __name__ == '__main__':
    app.run(debug=True)