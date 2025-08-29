import logging
from flask import Flask, render_template, request, jsonify
from utils.totp import TOTPService

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
totp_service = TOTPService("A3DH2B26SS4DNUW23NSU44NS2NS6B332")

@app.route('/')
def index():
    logger.info("Rendering index page")
    return render_template('index.html')

@app.route('/generate')
def generate():
    logger.info("Rendering generate page")
    return render_template('generate.html')

@app.route('/api/generate', methods=['GET'])
def api_generate():
    try:
        code, time_left = totp_service.generate()
        logger.info(f"Generated TOTP: {code}, time left: {time_left}s")
        return jsonify({'success': True, 'code': code, 'time_left': time_left})
    except Exception as e:
        logger.error(f"Generate API error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to generate TOTP'}), 500

@app.route('/validate')
def validate():
    logger.info("Rendering validate page")
    return render_template('validate.html')

@app.route('/api/validate', methods=['POST'])
def api_validate():
    user_input = request.form.get('code')
    if not user_input or not user_input.isdigit():
        logger.warning(f"Invalid input: {user_input}")
        return jsonify({'success': False, 'message': 'Please enter a valid numerical code'}), 400
    try:
        is_valid = totp_service.verify(user_input)
        logger.info(f"Validation result: {is_valid} for code {user_input}")
        return jsonify({
            'success': is_valid,
            'message': 'TOTP code is valid' if is_valid else 'TOTP code is invalid'
        })
    except Exception as e:
        logger.error(f"Validate API error: {str(e)}")
        return jsonify({'success': False, 'message': 'Validation failed'}), 500

if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(debug=True)