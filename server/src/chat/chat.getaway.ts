import { WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway(80, {namespaces: 'chat' })
export class chatgeteway()
{}