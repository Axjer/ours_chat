from flask import Flask, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
# 啟動 SocketIO 支援, 允許所有來源連線
socketio = SocketIO(app, cors_allowed_origins="*")

# 存放 session_id 對應的 username
connected_users = {}

def get_user_list():
    return [{'id': sid, 'name': name} for sid, name in connected_users.items()]

@socketio.on('user_join')
def handle_user_join(data):
    username = data.get('username', '匿名')
    old_name = connected_users.get(request.sid)
    connected_users[request.sid] = username
    
    if old_name:
        print(f"[系統] {old_name} 更名為 {username}")
        emit('system_message', {'msg': f'{old_name} 已更名為 {username}'}, broadcast=True)
    else:
        print(f"[系統] {username} 上線了")
        emit('system_message', {'msg': f'{username} 加入了聊天室！'}, broadcast=True)
        
    emit('update_user_list', {'users': get_user_list()}, broadcast=True)

@socketio.on('send_message')
def handle_message(data):
    username = connected_users.get(request.sid, "未知用戶")
    message = data.get('msg', '')
    emit('receive_message', {'sender_id': request.sid, 'username': username, 'msg': message}, broadcast=True)

@socketio.on('private_message')
def handle_private_message(data):
    sender = connected_users.get(request.sid, "未知用戶")
    target_user = data.get('target')
    message = data.get('msg', '')
    
    target_sids = [sid for sid, name in connected_users.items() if name == target_user]
    payload = {'sender': sender, 'target': target_user, 'msg': message}
    
    for sid in target_sids:
        emit('private_message', payload, to=sid)
        
    if sender != target_user:
        emit('private_message', payload, to=request.sid)

@socketio.on('read_messages')
def handle_read_messages(data):
    # reader = person who read the message
    reader = connected_users.get(request.sid, "未知用戶")
    # target = the person who sent the messages originally
    target_user = data.get('target')
    
    # send 'messages_read' event to the original sender
    target_sids = [sid for sid, name in connected_users.items() if name == target_user]
    payload = {'reader': reader}
    
    for sid in target_sids:
        emit('messages_read', payload, to=sid)

@socketio.on('disconnect')
def handle_disconnect():
    if request.sid in connected_users:
        username = connected_users.pop(request.sid)
        emit('update_user_list', {'users': get_user_list()}, broadcast=True)
        emit('system_message', {'msg': f'{username} 離開了連線。'}, broadcast=True)

if __name__ == '__main__':
    print("後端 API 伺服器啟動於 http://127.0.0.1:5000")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)
