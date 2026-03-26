#!/usr/bin/env python3
import json
import os
import subprocess
import sys
from pathlib import Path

# This is a standard MCP server template exposing the skills' Python scripts
# It listens on stdin/stdout for JSON-RPC messages.

def list_tools():
    tools = []
    skills_dir = Path("skills")
    if not skills_dir.exists():
        return tools

    for skill_dir in skills_dir.iterdir():
        if skill_dir.is_dir():
            scripts_dir = skill_dir / "scripts"
            if scripts_dir.exists() and scripts_dir.is_dir():
                for py_file in scripts_dir.glob("*.py"):
                    if py_file.name in ('__init__.py', 'models.py') or py_file.name.startswith('test'):
                        continue

                    tool_name = f"{skill_dir.name}_{py_file.stem}".replace("-", "_")
                    tools.append({
                        "name": tool_name,
                        "description": f"Execute the {py_file.name} script in the {skill_dir.name} skill.",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "args": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                    "description": "Command line arguments"
                                }
                            }
                        }
                    })
    return tools

def call_tool(name, arguments):
    # Map name back to script path
    skills_dir = Path("skills")
    for skill_dir in skills_dir.iterdir():
        if skill_dir.is_dir():
            scripts_dir = skill_dir / "scripts"
            if scripts_dir.exists() and scripts_dir.is_dir():
                for py_file in scripts_dir.glob("*.py"):
                    expected_name = f"{skill_dir.name}_{py_file.stem}".replace("-", "_")
                    if expected_name == name:
                        args = arguments.get("args", [])
                        cmd = ["python", str(py_file)] + args
                        try:
                            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
                            return {"content": [{"type": "text", "text": result.stdout}]}
                        except subprocess.CalledProcessError as e:
                            return {"isError": True, "content": [{"type": "text", "text": f"Error: {e.stderr}"}]}
    return {"isError": True, "content": [{"type": "text", "text": f"Tool {name} not found"}]}

def process_message(line):
    try:
        msg = json.loads(line)
        if msg.get("method") == "initialize":
            response = {
                "jsonrpc": "2.0",
                "id": msg["id"],
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {
                        "tools": {}
                    },
                    "serverInfo": {
                        "name": "agent-skills-mcp",
                        "version": "1.0.0"
                    }
                }
            }
            print(json.dumps(response), flush=True)
        elif msg.get("method") == "notifications/initialized":
            pass # Standard empty response to client initialization complete
        elif msg.get("method") == "tools/list":
            response = {"jsonrpc": "2.0", "id": msg["id"], "result": {"tools": list_tools()}}
            print(json.dumps(response), flush=True)
        elif msg.get("method") == "tools/call":
            result = call_tool(msg["params"]["name"], msg["params"].get("arguments", {}))
            response = {"jsonrpc": "2.0", "id": msg["id"], "result": result}
            print(json.dumps(response), flush=True)
        else:
            # Handle other methods or ignore
            pass
    except json.JSONDecodeError:
        pass

def main():
    for line in sys.stdin:
        process_message(line)

if __name__ == "__main__":
    main()
