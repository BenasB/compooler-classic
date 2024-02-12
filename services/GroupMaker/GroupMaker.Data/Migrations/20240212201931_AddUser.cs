using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GroupMaker.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DriverId",
                table: "Groups",
                type: "text",
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new { Id = table.Column<string>(type: "text", nullable: false) },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "GroupUser",
                columns: table => new
                {
                    PassengeringId = table.Column<int>(type: "integer", nullable: false),
                    PassengersId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupUser", x => new { x.PassengeringId, x.PassengersId });
                    table.ForeignKey(
                        name: "FK_GroupUser_Groups_PassengeringId",
                        column: x => x.PassengeringId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_GroupUser_Users_PassengersId",
                        column: x => x.PassengersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_Groups_DriverId",
                table: "Groups",
                column: "DriverId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_GroupUser_PassengersId",
                table: "GroupUser",
                column: "PassengersId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Users_DriverId",
                table: "Groups",
                column: "DriverId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Groups_Users_DriverId", table: "Groups");

            migrationBuilder.DropTable(name: "GroupUser");

            migrationBuilder.DropTable(name: "Users");

            migrationBuilder.DropIndex(name: "IX_Groups_DriverId", table: "Groups");

            migrationBuilder.DropColumn(name: "DriverId", table: "Groups");
        }
    }
}
