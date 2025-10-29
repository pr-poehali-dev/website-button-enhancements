import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send customer request to Telegram
    Args: event with httpMethod, body (name, phone, email, message, type)
    Returns: HTTP response with success status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Telegram credentials not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    name = body_data.get('name', 'Не указано')
    phone = body_data.get('phone', 'Не указано')
    email = body_data.get('email', 'Не указано')
    message = body_data.get('message', 'Не указано')
    request_type = body_data.get('type', 'Заявка')
    callback_time = body_data.get('callback_time', '')
    
    timestamp = datetime.now().strftime('%d.%m.%Y %H:%M')
    
    emoji_map = {
        'Заявка': '📝',
        'Обратный звонок': '📞',
        'Консультация': '💬'
    }
    
    emoji = emoji_map.get(request_type, '📋')
    
    telegram_message = f"""
{emoji} <b>Новая заявка: {request_type}</b>

👤 <b>Имя:</b> {name}
📱 <b>Телефон:</b> {phone}
📧 <b>Email:</b> {email}
"""
    
    if callback_time:
        telegram_message += f"🕐 <b>Удобное время:</b> {callback_time}\n"
    
    if message and message != 'Не указано':
        telegram_message += f"💬 <b>Сообщение:</b> {message}\n"
    
    telegram_message += f"\n⏰ <b>Время:</b> {timestamp}"
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    payload = {
        'chat_id': chat_id,
        'text': telegram_message,
        'parse_mode': 'HTML'
    }
    
    data = urllib.parse.urlencode(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data)
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            response_data = response.read()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'message': 'Request sent to Telegram'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Failed to send to Telegram: {str(e)}'}),
            'isBase64Encoded': False
        }
